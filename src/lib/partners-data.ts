// Données d'exemple : gestion des partenaires (revendeurs) côté propriétaire (UI uniquement).
// Modèle EVISIONS : le revendeur vend à crédit. Chaque vente augmente sa dette (crédit utilisé),
// plafonnée par la limite de crédit. Le propriétaire encaisse puis « solde » la dette.

export const OWNER_CODE = "FLU"; // dérivé du nom du réseau (FLUXIONWIFI)

export interface Partner {
  id: string;
  name: string;
  loginId: string;
  password: string;
  creditLimit: number;
  creditUsed: number;
  commission: number; // % sur vente
  status: "active" | "blocked";
}

export interface DebtMovement {
  id: string;
  partnerId: string;
  type: "sale" | "payment" | "adjustment";
  amount: number; // > 0 augmente la dette, < 0 la réduit
  note: string;
  at: string;
}

export interface Withdrawal {
  id: string;
  partnerId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  at: string;
}

export interface PartnerMessage {
  id: string;
  partnerId: string;
  from: "owner" | "partner";
  body: string;
  at: string;
}

export const INITIAL_PARTNERS: Partner[] = [
  { id: "r1", name: "FLUXIONWIFI", loginId: `FLX-${OWNER_CODE}-001-SITE`, password: "SERGE2026", creditLimit: 100000, creditUsed: 26500, commission: 0, status: "active" },
  { id: "r2", name: "Marché Central", loginId: `FLX-${OWNER_CODE}-002-SITE`, password: "MARCHE2026", creditLimit: 150000, creditUsed: 133500, commission: 10, status: "active" },
  { id: "r3", name: "Cyber Limete", loginId: `FLX-${OWNER_CODE}-003-SITE`, password: "LIMETE2026", creditLimit: 50000, creditUsed: 0, commission: 15, status: "blocked" },
];

export const INITIAL_MOVEMENTS: DebtMovement[] = [
  { id: "d1", partnerId: "r1", type: "sale", amount: 25000, note: "Vente (commission 0 %)", at: "2026-11-09T17:20:00Z" },
  { id: "d2", partnerId: "r1", type: "sale", amount: 1500, note: "Vente (commission 0 %)", at: "2026-11-12T10:05:00Z" },
  { id: "d3", partnerId: "r2", type: "sale", amount: 150000, note: "Vente (commission 10 %)", at: "2026-11-05T09:00:00Z" },
  { id: "d4", partnerId: "r2", type: "payment", amount: -16500, note: "Règlement reçu", at: "2026-11-10T16:40:00Z" },
];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [];

export const INITIAL_PARTNER_MESSAGES: PartnerMessage[] = [
  { id: "pm1", partnerId: "r2", from: "partner", body: "Bonjour, je règle ma dette demain matin.", at: "2026-11-17T09:25:00Z" },
];

export function generatePassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let p = "";
  for (let i = 0; i < 8; i++) p += alphabet[Math.floor(Math.random() * alphabet.length)];
  return p;
}

export function nextLoginId(existing: string[]): string {
  let n = existing.length + 1;
  let id = `FLX-${OWNER_CODE}-${String(n).padStart(3, "0")}-SITE`;
  while (existing.includes(id)) {
    n += 1;
    id = `FLX-${OWNER_CODE}-${String(n).padStart(3, "0")}-SITE`;
  }
  return id;
}
