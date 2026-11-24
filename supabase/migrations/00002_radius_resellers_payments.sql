-- ============================================================
-- FLUXIONWIFI — Migration 2 : RADIUS, espace revendeur, paiements, journal
-- ============================================================
-- Non appliquée automatiquement. À relire puis lancer avec `supabase db push`
-- ou depuis le SQL Editor.
--
-- Principe : les tickets vivent dans `public.tickets` (source de vérité).
-- Un trigger les recopie dans `radcheck` / `radreply` (schéma FreeRADIUS
-- standard, module rlm_sql PostgreSQL). Le serveur FreeRADIUS lit ces tables
-- et écrit les sessions dans `radacct`.
--
-- Côté serveur FreeRADIUS à prévoir (hors de cette migration) :
--   * module sql pointé sur ce Postgres, avec un rôle dédié (pas la service key)
--   * sqlcounter pour `Max-All-Session` (validité cumulée d'un ticket)
--   * un `nas` (clients) par routeur : voir la vue `public.radius_nas`
-- ============================================================


-- ============================================================
-- 1. Extensions des tables existantes
-- ============================================================

-- Profils tarifaires : attributs RADIUS
alter table public.ticket_profiles
  add column if not exists validity_minutes integer,            -- validité cumulée (null = illimitée)
  add column if not exists data_limit_mb integer,               -- quota (null = illimité)
  add column if not exists rate_limit text default '',          -- ex. "2M/5M" (Mikrotik-Rate-Limit)
  add column if not exists seller_price integer;                -- prix de cession revendeur (null = prix - commission)

-- Génération de tickets (config client : chiffres seulement, longueur)
alter table public.profiles
  add column if not exists ticket_charset text not null default 'numeric'
    check (ticket_charset in ('numeric', 'alphanumeric')),
  add column if not exists ticket_length integer not null default 8
    check (ticket_length between 4 and 16);

-- Routeurs : secret RADIUS (client NAS)
alter table public.routers
  add column if not exists radius_secret text not null default encode(gen_random_bytes(16), 'hex'),
  add column if not exists nas_identifier text;

-- Tickets : mot de passe RADIUS, origine, ticket nominatif, blocage
alter table public.tickets
  add column if not exists password text,
  add column if not exists source text not null default 'owner'
    check (source in ('owner', 'seller', 'online', 'special')),
  add column if not exists customer_name text,
  add column if not exists sold_price integer,
  add column if not exists sold_at timestamptz,
  add column if not exists blocked boolean not null default false;

-- Le nom d'utilisateur RADIUS est global : le code doit donc être unique sur toute la plateforme.
-- (échoue s'il existe déjà des doublons de code entre propriétaires)
create unique index if not exists idx_tickets_code_global on public.tickets(code);

-- Revendeurs : compte de connexion, crédit (modèle EVISIONS : vente à crédit, dette plafonnée)
alter table public.sellers
  add column if not exists login_id text,                       -- ex. FLX-KIL-003-SITE
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null,
  add column if not exists credit_limit integer not null default 0,   -- limite de crédit (dette max)
  add column if not exists credit_used integer not null default 0;   -- dette actuelle (crédit utilisé)

alter table public.sellers
  add constraint sellers_credit_check check (credit_used >= 0 and credit_limit >= 0);

create unique index if not exists idx_sellers_login on public.sellers(login_id) where login_id is not null;
create unique index if not exists idx_sellers_auth_user on public.sellers(auth_user_id) where auth_user_id is not null;


-- ============================================================
-- 2. Tables FreeRADIUS (schéma standard, rlm_sql postgresql)
-- ============================================================
create table if not exists public.radcheck (
  id bigserial primary key,
  username text not null default '',
  attribute text not null default '',
  op varchar(2) not null default ':=',
  value text not null default ''
);
create index if not exists radcheck_username on public.radcheck(username);

create table if not exists public.radreply (
  id bigserial primary key,
  username text not null default '',
  attribute text not null default '',
  op varchar(2) not null default '=',
  value text not null default ''
);
create index if not exists radreply_username on public.radreply(username);

create table if not exists public.radacct (
  radacctid bigserial primary key,
  acctsessionid text not null,
  acctuniqueid text not null unique,
  username text,
  realm text,
  nasipaddress inet not null,
  nasportid text,
  nasporttype text,
  acctstarttime timestamptz,
  acctupdatetime timestamptz,
  acctstoptime timestamptz,
  acctinterval bigint,
  acctsessiontime bigint,
  acctauthentic text,
  connectinfo_start text,
  connectinfo_stop text,
  acctinputoctets bigint,
  acctoutputoctets bigint,
  calledstationid text,
  callingstationid text,                                        -- adresse MAC du client
  acctterminatecause text,
  servicetype text,
  framedprotocol text,
  framedipaddress inet,
  nasidentifier text
);
create index if not exists radacct_username on public.radacct(username);
create index if not exists radacct_active on public.radacct(acctstoptime) where acctstoptime is null;
create index if not exists radacct_start on public.radacct(acctstarttime);

-- Accessibles uniquement par le rôle FreeRADIUS et la service key (aucune policy = aucun accès client)
alter table public.radcheck enable row level security;
alter table public.radreply enable row level security;
alter table public.radacct enable row level security;

-- Clients NAS (routeurs) pour FreeRADIUS (`read_clients = yes`)
create or replace view public.radius_nas as
  select
    r.id::text            as id,
    r.ip_address          as nasname,
    coalesce(r.nas_identifier, r.name) as shortname,
    'other'               as type,
    r.radius_secret       as secret
  from public.routers r;

revoke all on public.radius_nas from anon, authenticated;


-- ============================================================
-- 3. Synchronisation tickets -> radcheck / radreply
-- ============================================================
create or replace function public.sync_ticket_to_radius()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_profile public.ticket_profiles%rowtype;
  v_bytes bigint;
begin
  select * into v_profile from public.ticket_profiles where id = new.profile_id;

  delete from public.radcheck where username = new.code;
  delete from public.radreply where username = new.code;

  -- Authentification
  if new.blocked or new.status = 'expired' then
    insert into public.radcheck (username, attribute, op, value)
      values (new.code, 'Auth-Type', ':=', 'Reject');
    return new;
  end if;

  insert into public.radcheck (username, attribute, op, value)
    values (new.code, 'Cleartext-Password', ':=', coalesce(new.password, new.code));

  insert into public.radcheck (username, attribute, op, value)
    values (new.code, 'Simultaneous-Use', ':=', greatest(coalesce(v_profile.device_limit, 1), 1)::text);

  if new.expires_at is not null then
    insert into public.radcheck (username, attribute, op, value)
      values (new.code, 'Expiration', ':=', to_char(new.expires_at at time zone 'UTC', 'DD Mon YYYY HH24:MI:SS'));
  end if;

  if v_profile.validity_minutes is not null then
    insert into public.radcheck (username, attribute, op, value)
      values (new.code, 'Max-All-Session', ':=', (v_profile.validity_minutes * 60)::text);
  end if;

  -- Réponse au routeur MikroTik
  if coalesce(v_profile.rate_limit, '') <> '' then
    insert into public.radreply (username, attribute, op, value)
      values (new.code, 'Mikrotik-Rate-Limit', '=', v_profile.rate_limit);
  end if;

  if v_profile.data_limit_mb is not null then
    v_bytes := v_profile.data_limit_mb::bigint * 1024 * 1024;
    insert into public.radreply (username, attribute, op, value) values
      (new.code, 'Mikrotik-Total-Limit', '=', (v_bytes % 4294967296)::text),
      (new.code, 'Mikrotik-Total-Limit-Gigawords', '=', (v_bytes / 4294967296)::text);
  end if;

  return new;
end;
$$;

drop trigger if exists tickets_sync_radius on public.tickets;
create trigger tickets_sync_radius
  after insert or update of code, password, status, blocked, expires_at, profile_id on public.tickets
  for each row execute function public.sync_ticket_to_radius();

create or replace function public.remove_ticket_from_radius()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.radcheck where username = old.code;
  delete from public.radreply where username = old.code;
  return old;
end;
$$;

drop trigger if exists tickets_remove_radius on public.tickets;
create trigger tickets_remove_radius
  after delete on public.tickets
  for each row execute function public.remove_ticket_from_radius();

-- Vue "tickets en ligne" : sessions RADIUS ouvertes, rattachées au propriétaire
create or replace view public.online_tickets
with (security_invoker = on) as
  select
    t.owner_id,
    t.id as ticket_id,
    t.code,
    a.radacctid,
    a.nasipaddress,
    a.callingstationid as device_mac,
    a.framedipaddress  as ip_address,
    a.acctstarttime    as started_at,
    a.acctsessiontime  as session_seconds,
    a.acctinputoctets  as bytes_in,
    a.acctoutputoctets as bytes_out
  from public.radacct a
  join public.tickets t on t.code = a.username
  where a.acctstoptime is null;


-- ============================================================
-- 4. Génération de codes
-- ============================================================
create or replace function public.gen_ticket_code(p_charset text, p_length integer)
returns text
language plpgsql
volatile
as $$
declare
  v_alphabet text := case when p_charset = 'alphanumeric'
    then 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'   -- sans 0/O/1/I
    else '0123456789' end;
  v_code text;
  v_i integer;
begin
  loop
    v_code := '';
    for v_i in 1..p_length loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.tickets where code = v_code);
  end loop;
  return v_code;
end;
$$;


-- ============================================================
-- 5. Espace revendeur : crédit, ventes, messagerie
-- ============================================================
create type public.seller_ledger_type as enum ('sale', 'payment', 'adjustment');

create table public.seller_ledger (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.sellers(id) on delete cascade,
  type public.seller_ledger_type not null,
  amount integer not null,                       -- signé : + augmente la dette (vente), - la réduit (règlement)
  debt_after integer not null,
  ticket_id uuid references public.tickets(id) on delete set null,
  note text default '',
  created_at timestamptz not null default now()
);
create index idx_seller_ledger_seller on public.seller_ledger(seller_id, created_at desc);
create index idx_seller_ledger_owner on public.seller_ledger(owner_id);

create table public.seller_messages (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid references public.sellers(id) on delete cascade,   -- null = annonce à tous
  sender text not null check (sender in ('owner', 'seller')),
  kind text not null default 'message' check (kind in ('message', 'announcement')),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_seller_messages_seller on public.seller_messages(seller_id, created_at desc);
create index idx_seller_messages_owner on public.seller_messages(owner_id);

-- Vente d'un ticket par un revendeur connecté (atomique : dette, ticket, journal)
create or replace function public.seller_sell_ticket(p_profile_id uuid)
returns public.tickets
language plpgsql
security definer set search_path = public
as $$
declare
  v_seller public.sellers%rowtype;
  v_profile public.ticket_profiles%rowtype;
  v_owner public.profiles%rowtype;
  v_cost integer;
  v_debt integer;
  v_ticket public.tickets%rowtype;
  v_code text;
begin
  select * into v_seller from public.sellers where auth_user_id = auth.uid() for update;
  if not found then
    raise exception 'Compte revendeur introuvable';
  end if;
  if v_seller.status <> 'active' then
    raise exception 'Compte revendeur bloqué';
  end if;

  select * into v_profile from public.ticket_profiles
    where id = p_profile_id and owner_id = v_seller.owner_id and is_active;
  if not found then
    raise exception 'Profil tarifaire indisponible';
  end if;

  select * into v_owner from public.profiles where id = v_seller.owner_id;

  -- montant ajouté à la dette = prix moins commission
  v_cost := coalesce(v_profile.seller_price,
                     v_profile.price - (v_profile.price * v_seller.commission_rate / 100));
  v_debt := v_seller.credit_used + v_cost;

  if v_debt > v_seller.credit_limit then
    raise exception 'Limite de crédit atteinte';
  end if;

  v_code := public.gen_ticket_code(v_owner.ticket_charset, v_owner.ticket_length);

  insert into public.tickets (owner_id, profile_id, seller_id, code, password, status, source, sold_price, sold_at)
    values (v_seller.owner_id, v_profile.id, v_seller.id, v_code, v_code, 'available', 'seller', v_profile.price, now())
    returning * into v_ticket;

  update public.sellers
    set credit_used = v_debt,
        total_sold = total_sold + 1,
        total_revenue = total_revenue + v_profile.price,
        last_active = now()
    where id = v_seller.id;

  insert into public.seller_ledger (owner_id, seller_id, type, amount, debt_after, ticket_id, note)
    values (v_seller.owner_id, v_seller.id, 'sale', v_cost, v_debt, v_ticket.id, v_profile.name);

  insert into public.transactions (owner_id, type, label, description, amount, status, method, ticket_id, seller_id)
    values (v_seller.owner_id, 'sale', 'Vente revendeur', v_profile.name, v_profile.price, 'completed', 'seller', v_ticket.id, v_seller.id);

  return v_ticket;
end;
$$;

revoke all on function public.seller_sell_ticket(uuid) from public, anon;
grant execute on function public.seller_sell_ticket(uuid) to authenticated;

-- « Solder » : le propriétaire a encaissé, la dette du revendeur repasse à zéro
create or replace function public.owner_settle_seller(p_seller_id uuid)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  v_seller public.sellers%rowtype;
begin
  select * into v_seller from public.sellers where id = p_seller_id and owner_id = auth.uid() for update;
  if not found then
    raise exception 'Revendeur introuvable';
  end if;
  if v_seller.credit_used <= 0 then
    raise exception 'Aucune dette à solder';
  end if;

  update public.sellers set credit_used = 0 where id = v_seller.id;
  insert into public.seller_ledger (owner_id, seller_id, type, amount, debt_after, note)
    values (v_seller.owner_id, v_seller.id, 'payment', -v_seller.credit_used, 0, 'Règlement reçu');
  return v_seller.credit_used;
end;
$$;

revoke all on function public.owner_settle_seller(uuid) from public, anon;
grant execute on function public.owner_settle_seller(uuid) to authenticated;


-- ============================================================
-- 6. Paiements (FlexPay d'abord, autres fournisseurs ensuite)
-- ============================================================
create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'cancelled');
create type public.payment_purpose as enum ('ticket_sale', 'seller_settlement', 'subscription');

create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid references public.sellers(id) on delete set null,
  purpose public.payment_purpose not null,
  provider text not null,                        -- 'flexpay', 'fedapay', 'cinetpay'...
  provider_reference text,                       -- référence côté fournisseur
  status public.payment_status not null default 'pending',
  amount integer not null check (amount > 0),
  currency text not null,
  payer_phone text,
  ticket_profile_id uuid references public.ticket_profiles(id) on delete set null,
  ticket_id uuid references public.tickets(id) on delete set null,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index idx_payments_provider_ref on public.payments(provider, provider_reference) where provider_reference is not null;
create index idx_payments_owner on public.payments(owner_id, created_at desc);

create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.update_updated_at();


-- ============================================================
-- 7. Journal des actions
-- ============================================================
create table public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  actor_type text not null default 'owner' check (actor_type in ('owner', 'seller', 'system')),
  actor_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_activity_log_owner on public.activity_log(owner_id, created_at desc);


-- ============================================================
-- 8. Row Level Security
-- ============================================================
alter table public.seller_ledger enable row level security;
alter table public.seller_messages enable row level security;
alter table public.payments enable row level security;
alter table public.activity_log enable row level security;

-- Propriétaire
create policy "Owner access seller_ledger" on public.seller_ledger
  for select using (auth.uid() = owner_id);

create policy "Owner access seller_messages" on public.seller_messages
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Owner read payments" on public.payments
  for select using (auth.uid() = owner_id);

create policy "Owner read activity_log" on public.activity_log
  for select using (auth.uid() = owner_id);

-- Revendeur connecté : sa propre fiche, ses tickets, son historique, ses messages
create policy "Seller reads own row" on public.sellers
  for select using (auth.uid() = auth_user_id);

create policy "Seller reads own tickets" on public.tickets
  for select using (seller_id in (select id from public.sellers where auth_user_id = auth.uid()));

create policy "Seller reads own ledger" on public.seller_ledger
  for select using (seller_id in (select id from public.sellers where auth_user_id = auth.uid()));

create policy "Seller reads active profiles of owner" on public.ticket_profiles
  for select using (
    is_active and owner_id in (select owner_id from public.sellers where auth_user_id = auth.uid())
  );

create policy "Seller reads own messages and announcements" on public.seller_messages
  for select using (
    seller_id in (select id from public.sellers where auth_user_id = auth.uid())
    or (seller_id is null and owner_id in (select owner_id from public.sellers where auth_user_id = auth.uid()))
  );

create policy "Seller writes own messages" on public.seller_messages
  for insert with check (
    sender = 'seller'
    and seller_id in (select id from public.sellers where auth_user_id = auth.uid())
  );

-- Les écritures sur payments, activity_log et radius* passent par la service key (serveur uniquement).
