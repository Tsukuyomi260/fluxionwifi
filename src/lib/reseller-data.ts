// Données d'exemple de l'espace revendeur (UI uniquement, remplacées par Supabase au back-end).

export const RESELLER_CURRENCY = "CDF";

export interface ResellerProfileItem {
  id: string;
  name: string;
  price: number;
  validity: string;
  quota: string;
}

export interface Sale {
  id: string;
  code: string;
  profileName: string;
  price: number;
  cost: number;
  at: string; // ISO
}

export interface LedgerEntry {
  id: string;
  type: "topup" | "sale" | "refund" | "adjustment";
  amount: number; // signé
  balanceAfter: number;
  note: string;
  at: string;
}

export interface ChatMessage {
  id: string;
  from: "owner" | "seller";
  kind: "message" | "announcement";
  body: string;
  at: string;
}

export const RESELLER = {
  name: "Kilimani Site 03",
  loginId: "FLX-KIL-003-SITE",
  network: "FLUXIONWIFI",
  commissionRate: 15,
  initialBalance: 39257,
};

export const RESELLER_PROFILES: ResellerProfileItem[] = [
  { id: "p1", name: "Illimité Promo 1J", price: 2000, validity: "1 jour", quota: "Illimité" },
  { id: "p2", name: "Illimité 7J", price: 12500, validity: "7 jours", quota: "Illimité" },
  { id: "p3", name: "Illimité 30J", price: 25000, validity: "30 jours", quota: "Illimité" },
  { id: "p4", name: "1GB 24H", price: 1500, validity: "24 heures", quota: "1 Go" },
  { id: "p5", name: "2GB 2J", price: 2000, validity: "2 jours", quota: "2 Go" },
  { id: "p6", name: "3GB 4J", price: 4500, validity: "4 jours", quota: "3 Go" },
  { id: "p7", name: "4GB 7J", price: 5500, validity: "7 jours", quota: "4 Go" },
  { id: "p8", name: "5GB 30J", price: 10000, validity: "30 jours", quota: "5 Go" },
  { id: "p9", name: "10GB 30J", price: 12500, validity: "30 jours", quota: "10 Go" },
  { id: "p10", name: "15GB 30J", price: 16500, validity: "30 jours", quota: "15 Go" },
  { id: "p11", name: "20GB 30J", price: 23500, validity: "30 jours", quota: "20 Go" },
  { id: "p12", name: "30GB 30J", price: 35000, validity: "30 jours", quota: "30 Go" },
  { id: "p13", name: "65GB 30J", price: 65000, validity: "30 jours", quota: "65 Go" },
];

export const INITIAL_SALES: Sale[] = [
  { id: "s1", code: "48201937", profileName: "1GB 24H", price: 1500, cost: 1275, at: "2026-11-18T09:12:00Z" },
  { id: "s2", code: "90356214", profileName: "Illimité Promo 1J", price: 2000, cost: 1700, at: "2026-11-18T10:40:00Z" },
  { id: "s3", code: "17740582", profileName: "10GB 30J", price: 12500, cost: 10625, at: "2026-11-17T15:05:00Z" },
  { id: "s4", code: "63019475", profileName: "2GB 2J", price: 2000, cost: 1700, at: "2026-11-17T08:30:00Z" },
  { id: "s5", code: "25598806", profileName: "5GB 30J", price: 10000, cost: 8500, at: "2026-11-15T17:22:00Z" },
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  { id: "l1", type: "topup", amount: 50000, balanceAfter: 50000, note: "Recharge par le propriétaire", at: "2026-11-14T08:00:00Z" },
  { id: "l2", type: "sale", amount: -8500, balanceAfter: 41500, note: "5GB 30J", at: "2026-11-15T17:22:00Z" },
  { id: "l3", type: "sale", amount: -1700, balanceAfter: 39800, note: "2GB 2J", at: "2026-11-17T08:30:00Z" },
  { id: "l4", type: "sale", amount: -10625, balanceAfter: 29175, note: "10GB 30J", at: "2026-11-17T15:05:00Z" },
  { id: "l5", type: "topup", amount: 15000, balanceAfter: 44175, note: "Recharge par le propriétaire", at: "2026-11-18T07:30:00Z" },
  { id: "l6", type: "sale", amount: -1275, balanceAfter: 42900, note: "1GB 24H", at: "2026-11-18T09:12:00Z" },
  { id: "l7", type: "sale", amount: -1700, balanceAfter: 41200, note: "Illimité Promo 1J", at: "2026-11-18T10:40:00Z" },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "m1", from: "owner", kind: "announcement", body: "Nouveau tarif : le forfait 4GB 7J passe à 5 500 CDF dès aujourd'hui.", at: "2026-11-16T07:00:00Z" },
  { id: "m2", from: "owner", kind: "message", body: "Bonjour, comment se passent les ventes cette semaine ?", at: "2026-11-17T09:10:00Z" },
  { id: "m3", from: "seller", kind: "message", body: "Bonjour, ça va bien. J'ai besoin d'une recharge de crédit demain.", at: "2026-11-17T09:25:00Z" },
  { id: "m4", from: "owner", kind: "message", body: "C'est noté, je recharge 15 000 CDF dans la matinée.", at: "2026-11-17T09:40:00Z" },
];

export function netCost(price: number, commissionRate: number): number {
  return price - Math.round((price * commissionRate) / 100);
}

export function formatCdf(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} ${RESELLER_CURRENCY}`;
}

// Format de date fixe (fuseau explicite) pour éviter tout écart serveur/navigateur.
const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Africa/Kinshasa",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function generateCode(): string {
  let code = "";
  for (let i = 0; i < 8; i++) code += Math.floor(Math.random() * 10);
  return code;
}
