-- ============================================================
-- FLUXIONWIFI — Initial Database Schema
-- ============================================================
-- Run this migration in your Supabase SQL Editor
-- or via: supabase db push
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";


-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text default '',
  country text not null default 'CD',
  company text default '',
  network_name text default '',
  avatar_url text default '',
  language text not null default 'fr' check (language in ('fr', 'en', 'pt')),
  timezone text not null default 'Africa/Kinshasa',
  ticket_format text not null default 'CODE-4X4' check (ticket_format in ('CODE-4X4', 'CODE-8', 'CODE-6')),
  auto_print boolean not null default false,
  sms_enabled boolean not null default false,
  api_key text default encode(gen_random_bytes(32), 'hex'),
  webhook_url text default '',
  webhook_events text[] default '{}',
  -- notification preferences
  notif_email_sales boolean not null default true,
  notif_email_connections boolean not null default false,
  notif_email_routers boolean not null default true,
  notif_email_billing boolean not null default true,
  notif_email_security boolean not null default true,
  notif_email_updates boolean not null default false,
  notif_push_offline boolean not null default true,
  notif_push_sales boolean not null default false,
  notif_push_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profile extending Supabase auth';

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'country', 'CD')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();


-- ============================================================
-- 2. ROUTERS (MikroTik devices)
-- ============================================================
create type public.router_status as enum ('online', 'offline', 'warning');
create type public.router_zone as enum ('sud', 'nord', 'est', 'ouest', 'centre');

create table public.routers (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  ip_address text not null,
  api_port integer not null default 8728,
  model text default '',
  identity text default '',
  zone public.router_zone default 'centre',
  location text default '',
  status public.router_status not null default 'offline',
  roaming_enabled boolean not null default false,
  cpu_usage integer default 0,
  memory_usage integer default 0,
  uptime text default '',
  clients_connected integer default 0,
  last_sync timestamptz,
  last_seen timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_routers_owner on public.routers(owner_id);
create index idx_routers_status on public.routers(status);

create trigger routers_updated_at
  before update on public.routers
  for each row execute function public.update_updated_at();


-- ============================================================
-- 3. PORTALS (Captive portals)
-- ============================================================
create type public.portal_status as enum ('active', 'inactive', 'draft');
create type public.auth_method as enum ('ticket', 'free', 'mobile_money', 'social');

create table public.portals (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text default '',
  status public.portal_status not null default 'draft',
  theme_name text default 'Moderne Bleu',
  theme_color text default '#2B7FFF',
  auth_methods public.auth_method[] not null default '{ticket}',
  logo_url text default '',
  background_url text default '',
  title text default 'Bienvenue',
  subtitle text default 'Connectez-vous au WiFi',
  button_text text default 'Se connecter',
  redirect_url text default '',
  terms_url text default '',
  ad_banner_url text default '',
  ad_link text default '',
  language text default 'fr',
  border_radius integer default 12,
  total_connections integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_portals_owner on public.portals(owner_id);

create trigger portals_updated_at
  before update on public.portals
  for each row execute function public.update_updated_at();

-- Portal ↔ Router link (many-to-many)
create table public.portal_routers (
  portal_id uuid not null references public.portals(id) on delete cascade,
  router_id uuid not null references public.routers(id) on delete cascade,
  primary key (portal_id, router_id)
);


-- ============================================================
-- 4. TICKET PROFILES (pricing plans)
-- ============================================================
create table public.ticket_profiles (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  duration text not null default '1h',
  price integer not null default 0,
  speed_limit text default '',
  device_limit integer not null default 1,
  color text default '#2B7FFF',
  sort_order integer default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_ticket_profiles_owner on public.ticket_profiles(owner_id);

create trigger ticket_profiles_updated_at
  before update on public.ticket_profiles
  for each row execute function public.update_updated_at();


-- ============================================================
-- 5. SELLERS (field resellers) — before tickets (FK dependency)
-- ============================================================
create type public.seller_status as enum ('active', 'inactive', 'suspended');

create table public.sellers (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text not null default '',
  location text default '',
  status public.seller_status not null default 'active',
  commission_rate integer not null default 15,
  total_assigned integer not null default 0,
  total_sold integer not null default 0,
  total_revenue integer not null default 0,
  stock_remaining integer not null default 0,
  last_active timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_sellers_owner on public.sellers(owner_id);

create trigger sellers_updated_at
  before update on public.sellers
  for each row execute function public.update_updated_at();


-- ============================================================
-- 6. TICKETS (WiFi access codes)
-- ============================================================
create type public.ticket_status as enum ('available', 'active', 'used', 'expired');

create table public.tickets (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  profile_id uuid not null references public.ticket_profiles(id) on delete restrict,
  seller_id uuid references public.sellers(id) on delete set null,
  code text not null,
  status public.ticket_status not null default 'available',
  used_at timestamptz,
  expires_at timestamptz,
  device_mac text default '',
  router_id uuid references public.routers(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index idx_tickets_code_owner on public.tickets(owner_id, code);
create index idx_tickets_owner on public.tickets(owner_id);
create index idx_tickets_status on public.tickets(status);
create index idx_tickets_seller on public.tickets(seller_id);
create index idx_tickets_profile on public.tickets(profile_id);


-- ============================================================
-- 7. TRANSACTIONS (financial ledger)
-- ============================================================
create type public.transaction_type as enum ('sale', 'withdrawal', 'commission', 'refund', 'topup');
create type public.transaction_status as enum ('completed', 'pending', 'failed');

create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type public.transaction_type not null,
  label text not null,
  description text default '',
  amount integer not null,
  status public.transaction_status not null default 'completed',
  method text default '',
  ticket_id uuid references public.tickets(id) on delete set null,
  seller_id uuid references public.sellers(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_transactions_owner on public.transactions(owner_id);
create index idx_transactions_type on public.transactions(type);
create index idx_transactions_created on public.transactions(created_at desc);


-- ============================================================
-- 8. SESSIONS (RADIUS / active WiFi connections)
-- ============================================================
create table public.sessions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  ticket_id uuid references public.tickets(id) on delete set null,
  router_id uuid references public.routers(id) on delete set null,
  device_mac text not null default '',
  device_name text default '',
  ip_address text default '',
  bytes_in bigint not null default 0,
  bytes_out bigint not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  is_active boolean not null default true
);

create index idx_sessions_owner on public.sessions(owner_id);
create index idx_sessions_active on public.sessions(is_active) where is_active = true;
create index idx_sessions_ticket on public.sessions(ticket_id);


-- ============================================================
-- 9. VPN TUNNELS
-- ============================================================
create type public.vpn_protocol as enum ('WireGuard', 'SSTP');
create type public.tunnel_status as enum ('connected', 'disconnected', 'connecting');

create table public.vpn_tunnels (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  protocol public.vpn_protocol not null default 'WireGuard',
  status public.tunnel_status not null default 'disconnected',
  server_ip text not null default '',
  local_ip text default '',
  port integer not null default 51820,
  public_key text default '',
  router_id uuid references public.routers(id) on delete set null,
  uptime text default '',
  last_seen timestamptz,
  bytes_in bigint not null default 0,
  bytes_out bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_vpn_tunnels_owner on public.vpn_tunnels(owner_id);

create trigger vpn_tunnels_updated_at
  before update on public.vpn_tunnels
  for each row execute function public.update_updated_at();


-- ============================================================
-- 10. SUPPORT TICKETS
-- ============================================================
create type public.support_priority as enum ('low', 'medium', 'high');
create type public.support_status as enum ('open', 'in_progress', 'resolved', 'closed');

create table public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  description text default '',
  category text default 'general',
  priority public.support_priority not null default 'medium',
  status public.support_status not null default 'open',
  attachment_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_support_tickets_owner on public.support_tickets(owner_id);
create index idx_support_tickets_status on public.support_tickets(status);

create trigger support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.update_updated_at();

-- Support ticket messages (thread)
create table public.support_messages (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_type text not null default 'user' check (sender_type in ('user', 'agent', 'bot')),
  message text not null,
  attachment_url text default '',
  created_at timestamptz not null default now()
);

create index idx_support_messages_ticket on public.support_messages(ticket_id);


-- ============================================================
-- 11. STOCK ASSIGNMENTS (seller stock history)
-- ============================================================
create table public.stock_assignments (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.sellers(id) on delete cascade,
  profile_id uuid not null references public.ticket_profiles(id) on delete restrict,
  quantity integer not null,
  type text not null default 'assign' check (type in ('assign', 'return')),
  created_at timestamptz not null default now()
);

create index idx_stock_assignments_seller on public.stock_assignments(seller_id);


-- ============================================================
-- 12. AFFILIATIONS (referral program)
-- ============================================================
create table public.affiliations (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid references public.profiles(id) on delete set null,
  referred_email text not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'inactive')),
  plan text default '',
  total_earned integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_affiliations_referrer on public.affiliations(referrer_id);


-- ============================================================
-- 13. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.routers enable row level security;
alter table public.portals enable row level security;
alter table public.portal_routers enable row level security;
alter table public.ticket_profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.sellers enable row level security;
alter table public.transactions enable row level security;
alter table public.sessions enable row level security;
alter table public.vpn_tunnels enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.stock_assignments enable row level security;
alter table public.affiliations enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Generic owner-based policies (same pattern for most tables)
-- Routers
create policy "Owner access routers"
  on public.routers for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Portals
create policy "Owner access portals"
  on public.portals for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Portal routers (access via portal ownership)
create policy "Owner access portal_routers"
  on public.portal_routers for all
  using (
    exists (
      select 1 from public.portals
      where portals.id = portal_routers.portal_id
      and portals.owner_id = auth.uid()
    )
  );

-- Ticket profiles
create policy "Owner access ticket_profiles"
  on public.ticket_profiles for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Tickets
create policy "Owner access tickets"
  on public.tickets for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Sellers
create policy "Owner access sellers"
  on public.sellers for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Transactions
create policy "Owner access transactions"
  on public.transactions for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Sessions
create policy "Owner access sessions"
  on public.sessions for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- VPN tunnels
create policy "Owner access vpn_tunnels"
  on public.vpn_tunnels for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Support tickets
create policy "Owner access support_tickets"
  on public.support_tickets for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Support messages (via ticket ownership)
create policy "Owner access support_messages"
  on public.support_messages for all
  using (
    exists (
      select 1 from public.support_tickets
      where support_tickets.id = support_messages.ticket_id
      and support_tickets.owner_id = auth.uid()
    )
  );

-- Stock assignments
create policy "Owner access stock_assignments"
  on public.stock_assignments for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Affiliations
create policy "Referrer access affiliations"
  on public.affiliations for all
  using (auth.uid() = referrer_id)
  with check (auth.uid() = referrer_id);
