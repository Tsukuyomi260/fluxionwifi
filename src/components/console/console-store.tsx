"use client";

// Données d'exemple de la Console (UI uniquement). Remplacées par Supabase/RADIUS au back-end.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface TariffProfile {
  id: string;
  name: string;
  sessionDuration: string; // uptime cumulé, ex. "1d" (vide = illimité)
  validity: string; // validité après 1er login
  rateLimit: string; // ex. "2M/2M"
  quotaValue: number; // 0 = illimité
  quotaUnit: "Mo" | "Go";
  devices: number;
  price: number;
  reducedRate: string; // débit réduit après quota
}

export type TicketState = "neuf" | "actif" | "epuise";

export interface ConsoleTicket {
  id: string;
  lotId: string;
  profileId: string;
  user: string;
  password: string;
  state: TicketState;
  printed: boolean;
  special: boolean;
}

export interface Lot {
  id: string;
  profileId: string;
  seller: string;
  createdAt: string;
  count: number;
}

export interface SaleRow {
  id: number;
  at: string;
  user: string;
  profileId: string;
  comment: string;
  price: number;
  ip: string;
  mac: string;
  validity: string;
  seller: string;
}

export interface CodeSettings {
  mode: "userpass" | "voucher"; // voucher : utilisateur = mot de passe
  length: number;
  charset: "digits" | "letters" | "alnum";
  prefix: string;
  uppercase: boolean;
}

const SEED_PROFILES: TariffProfile[] = [
  ["Illimité-Promotion-1D", "1d", "1d", 0, 2000],
  ["illimieté-7D", "7d", "7d", 0, 12500],
  ["illimieté-30D", "30d", "30d", 0, 25000],
  ["1GB-24H", "1d", "1d", 1, 1500],
  ["2GB-2D", "2d", "2d", 2, 2000],
  ["3GB-4D", "4d", "4d", 3, 4500],
  ["4GB-7D", "7d", "7d", 4, 5500],
  ["5GB-30D", "30d", "30d", 5, 10000],
  ["10GB-30D", "30d", "30d", 10, 12500],
  ["15GB-30D", "30d", "30d", 15, 16500],
  ["18GB-30D", "30d", "30d", 18, 17500],
  ["20GB-30D", "30d", "30d", 20, 23500],
  ["30GB-30D", "30d", "30d", 30, 35000],
  ["65GB-30D", "30d", "30d", 65, 65000],
].map(([name, dur, val, q, price], i) => ({
  id: `pf${i + 1}`,
  name: name as string,
  sessionDuration: dur as string,
  validity: val as string,
  rateLimit: "",
  quotaValue: q as number,
  quotaUnit: "Go" as const,
  devices: 1,
  price: price as number,
  reducedRate: "",
}));

// Générateur pseudo-aléatoire déterministe (évite tout écart serveur/navigateur dans les données d'exemple).
function seeded(seed: number) {
  let x = seed;
  return () => {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

function seedTickets(): { tickets: ConsoleTicket[]; lots: Lot[] } {
  const rnd = seeded(42);
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const tickets: ConsoleTicket[] = [];
  const lots: Lot[] = [];
  SEED_PROFILES.forEach((p, pi) => {
    const lotId = `lot${pi + 1}`;
    const count = 8 + (pi % 4) * 2;
    lots.push({ id: lotId, profileId: p.id, seller: "Moi (admin)", createdAt: `2026-11-${String(10 + (pi % 8)).padStart(2, "0")}T09:00:00Z`, count });
    for (let i = 0; i < count; i++) {
      let code = "";
      for (let k = 0; k < 5; k++) code += letters[Math.floor(rnd() * letters.length)];
      const r = rnd();
      tickets.push({
        id: `t${pi}-${i}`,
        lotId,
        profileId: p.id,
        user: code,
        password: code,
        state: r < 0.55 ? "neuf" : r < 0.7 ? "actif" : "epuise",
        printed: r > 0.35,
        special: false,
      });
    }
  });
  return { tickets, lots };
}

function seedSales(): SaleRow[] {
  const rows: SaleRow[] = [];
  const rnd = seeded(7);
  const used = SEED_PROFILES.slice(0, 6);
  for (let i = 0; i < 14; i++) {
    const p = used[Math.floor(rnd() * used.length)];
    const hh = String(8 + Math.floor(rnd() * 12)).padStart(2, "0");
    const mm = String(Math.floor(rnd() * 60)).padStart(2, "0");
    rows.push({
      id: 77 - i,
      at: `2026-11-18T${hh}:${mm}:00`,
      user: ["EQFHV", "AAZBP", "CUQDN", "HUBGW", "VRBXE", "GSMKF", "LENKW"][i % 7] + (i > 6 ? "2" : ""),
      profileId: p.id,
      comment: "—",
      price: p.price,
      ip: `10.0.0.${20 + Math.floor(rnd() * 200)}`,
      mac: Array.from({ length: 6 }, () => Math.floor(rnd() * 256).toString(16).padStart(2, "0").toUpperCase()).join(":"),
      validity: p.validity,
      seller: ["FLX-FLU-001-SITE", "FLX-FLU-002-SITE", "Moi (admin)"][i % 3],
    });
  }
  return rows;
}

interface ConsoleStore {
  profiles: TariffProfile[];
  tickets: ConsoleTicket[];
  lots: Lot[];
  sales: SaleRow[];
  settings: CodeSettings;
  lastLot: { lot: Lot; tickets: ConsoleTicket[] } | null;
  saveProfile: (p: Omit<TariffProfile, "id">) => { updated: boolean };
  deleteProfile: (id: string) => void;
  generate: (profileId: string, quantity: number, seller: string) => Lot | null;
  createSpecific: (profileId: string, user: string, password: string) => { ok: true; ticket: ConsoleTicket } | { ok: false; error: string };
  suggestUser: () => string;
  updateSettings: (s: CodeSettings) => void;
  clearLot: (lotId: string) => void;
  clearProfile: (profileId: string) => void;
  deleteTickets: (ids: string[]) => void;
  markPrinted: (ids: string[]) => void;
}

const Ctx = createContext<ConsoleStore | null>(null);

export function useConsoleStore(): ConsoleStore {
  const c = useContext(Ctx);
  if (!c) throw new Error("useConsoleStore doit être utilisé dans <ConsoleStoreProvider>");
  return c;
}

let counter = 500;
const nid = (p: string) => `${p}${++counter}`;

function randomCode(settings: CodeSettings): string {
  const alphabet = settings.charset === "digits" ? "0123456789" : settings.charset === "letters" ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < settings.length; i++) c += alphabet[Math.floor(Math.random() * alphabet.length)];
  return settings.prefix + c;
}

export function ConsoleStoreProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<TariffProfile[]>(SEED_PROFILES);
  const seeded0 = useMemo(seedTickets, []);
  const [tickets, setTickets] = useState<ConsoleTicket[]>(seeded0.tickets);
  const [lots, setLots] = useState<Lot[]>(seeded0.lots);
  const [sales] = useState<SaleRow[]>(seedSales);
  const [settings, setSettings] = useState<CodeSettings>({ mode: "userpass", length: 5, charset: "letters", prefix: "", uppercase: true });
  const [lastLot, setLastLot] = useState<ConsoleStore["lastLot"]>(null);

  const saveProfile = useCallback<ConsoleStore["saveProfile"]>((p) => {
    let updated = false;
    setProfiles((ps) => {
      const existing = ps.find((x) => x.name.toLowerCase() === p.name.trim().toLowerCase());
      if (existing) {
        updated = true;
        return ps.map((x) => (x.id === existing.id ? { ...p, id: x.id, name: p.name.trim() } : x));
      }
      return [...ps, { ...p, id: nid("pf"), name: p.name.trim() }];
    });
    return { updated };
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((ps) => ps.filter((p) => p.id !== id));
    setTickets((ts) => ts.filter((t) => t.profileId !== id));
    setLots((ls) => ls.filter((l) => l.profileId !== id));
  }, []);

  const generate = useCallback<ConsoleStore["generate"]>(
    (profileId, quantity, seller) => {
      if (quantity < 1) return null;
      const lot: Lot = { id: nid("lot"), profileId, seller, createdAt: new Date().toISOString(), count: quantity };
      const made: ConsoleTicket[] = Array.from({ length: quantity }, () => {
        const user = randomCode(settings);
        return {
          id: nid("t"),
          lotId: lot.id,
          profileId,
          user,
          password: settings.mode === "voucher" ? user : randomCode(settings),
          state: "neuf" as const,
          printed: false,
          special: false,
        };
      });
      setLots((ls) => [lot, ...ls]);
      setTickets((ts) => [...made, ...ts]);
      setLastLot({ lot, tickets: made });
      return lot;
    },
    [settings]
  );

  const suggestUser = useCallback(() => randomCode(settings), [settings]);

  const createSpecific = useCallback<ConsoleStore["createSpecific"]>(
    (profileId, user, password) => {
      const u = user.trim();
      if (!u) return { ok: false, error: "Le nom d'utilisateur est obligatoire." };
      if (tickets.some((t) => t.user.toLowerCase() === u.toLowerCase())) return { ok: false, error: "Ce nom d'utilisateur existe déjà." };
      const lot: Lot = { id: nid("lot"), profileId, seller: "Moi (admin)", createdAt: new Date().toISOString(), count: 1 };
      const ticket: ConsoleTicket = {
        id: nid("t"),
        lotId: lot.id,
        profileId,
        user: u,
        password: password.trim() || u,
        state: "neuf",
        printed: false,
        special: true,
      };
      setLots((ls) => [lot, ...ls]);
      setTickets((ts) => [ticket, ...ts]);
      setLastLot({ lot, tickets: [ticket] });
      return { ok: true, ticket };
    },
    [tickets]
  );

  const clearLot = useCallback((lotId: string) => {
    setTickets((ts) => ts.filter((t) => t.lotId !== lotId));
    setLots((ls) => ls.filter((l) => l.id !== lotId));
  }, []);
  const clearProfile = useCallback((profileId: string) => {
    setTickets((ts) => ts.filter((t) => t.profileId !== profileId));
    setLots((ls) => ls.filter((l) => l.profileId !== profileId));
  }, []);
  const deleteTickets = useCallback((ids: string[]) => setTickets((ts) => ts.filter((t) => !ids.includes(t.id))), []);
  const markPrinted = useCallback((ids: string[]) => setTickets((ts) => ts.map((t) => (ids.includes(t.id) ? { ...t, printed: true } : t))), []);

  const value = useMemo<ConsoleStore>(
    () => ({
      profiles, tickets, lots, sales, settings, lastLot,
      saveProfile, deleteProfile, generate, createSpecific, suggestUser,
      updateSettings: setSettings, clearLot, clearProfile, deleteTickets, markPrinted,
    }),
    [profiles, tickets, lots, sales, settings, lastLot, saveProfile, deleteProfile, generate, createSpecific, suggestUser, clearLot, clearProfile, deleteTickets, markPrinted]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
