// Données d'exemple pour la vérification de tickets (UI uniquement).
// Au back-end : l'état viendra de RADIUS (radcheck / radacct), pas de la page.

export type TicketStatus = "neuf" | "actif" | "epuise" | "bloque";

export interface TicketInfo {
  code: string;
  profile: string;
  status: TicketStatus;
  price: number;
  consumed: string;
  remaining: string;
  router: string;
  mac: string;
  seller: string;
}

const KNOWN: TicketInfo[] = [
  { code: "48201937", profile: "1GB 24H", status: "actif", price: 1500, consumed: "312 Mo", remaining: "712 Mo · 19 h", router: "FLX-FLU-001-Site", mac: "72:84:F1:3F:7C:F6", seller: "FLX-FLU-001-SITE" },
  { code: "90356214", profile: "Illimité Promo 1J", status: "neuf", price: 2000, consumed: "—", remaining: "1 jour", router: "—", mac: "—", seller: "FLX-FLU-001-SITE" },
  { code: "17740582", profile: "10GB 30J", status: "epuise", price: 12500, consumed: "10 Go", remaining: "0", router: "FLX-FLU-003-Site", mac: "52:E6:60:14:12:A7", seller: "FLX-FLU-002-SITE" },
  { code: "QQECB", profile: "Illimité-Promotion-1D", status: "actif", price: 2000, consumed: "554 Mo", remaining: "23 h", router: "FLX-FLU-001-Site", mac: "00:27:15:78:04:4A", seller: "Moi (admin)" },
  { code: "XTDEA", profile: "30GB-30D", status: "bloque", price: 35000, consumed: "2,1 Go", remaining: "—", router: "FLX-FLU-006-Site", mac: "0A:C0:7B:28:88:14", seller: "Moi (admin)" },
];

export function lookupTicket(code: string): TicketInfo | null {
  const c = code.trim().toLowerCase();
  if (!c) return null;
  return KNOWN.find((t) => t.code.toLowerCase() === c) ?? null;
}

export interface TicketReport {
  id: string;
  code: string;
  client: string;
  message: string;
  at: string;
  resolved: boolean;
}

export const INITIAL_REPORTS: TicketReport[] = [
  { id: "sg1", code: "17740582", client: "+243 81 555 0102", message: "Le ticket affiche « épuisé » alors que je ne l'ai pas utilisé.", at: "2026-11-18T08:40:00Z", resolved: false },
  { id: "sg2", code: "XTDEA", client: "+243 99 555 0177", message: "Impossible de me connecter, le code est refusé.", at: "2026-11-17T16:05:00Z", resolved: false },
  { id: "sg3", code: "90356214", client: "+243 82 555 0140", message: "Question sur la durée de validité.", at: "2026-11-15T10:20:00Z", resolved: true },
];
