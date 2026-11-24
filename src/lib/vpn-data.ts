// Données de démonstration du module VPN (remplacées par Supabase au backend).

export type RouterState = "online" | "configured" | "suspended";

export interface VpnRouterRow {
  id: string;
  name: string;
  protocol: "SSTP" | "WireGuard";
  ros: "v6" | "v7";
  state: RouterState;
  passwordVerified: boolean | null; // null = vérification impossible
  note: string;
  tunnelIp: string;
  winboxPort: number;
  apiPort: number;
  publicKey: string;
  createdAt: string;
  score: number;
  antennas: string[];
  suspendedReason?: string;
}

export const DEMO_ROUTERS: VpnRouterRow[] = [
  { id: "r1", name: "Routeur Kinshasa", protocol: "SSTP", ros: "v7", state: "online", passwordVerified: true, note: "", tunnelIp: "100.64.0.47", winboxPort: 13047, apiPort: 23047, publicKey: "", createdAt: "12/08/26 16:24", score: 87, antennas: ["Antenne A", "Antenne B"] },
  { id: "r2", name: "Site Gombe", protocol: "SSTP", ros: "v6", state: "online", passwordVerified: true, note: "admin/+243 800 000 001", tunnelIp: "100.64.0.48", winboxPort: 13048, apiPort: 23048, publicKey: "", createdAt: "09/08/26 12:21", score: 78, antennas: ["Antenne C"] },
  { id: "r3", name: "Site Limete", protocol: "SSTP", ros: "v6", state: "configured", passwordVerified: null, note: "limete/+243 800 000 002", tunnelIp: "100.64.0.45", winboxPort: 13045, apiPort: 23045, publicKey: "", createdAt: "08/08/26 22:30", score: 62, antennas: ["Antenne D", "Antenne E"] },
  { id: "r4", name: "Site Lubumbashi", protocol: "SSTP", ros: "v7", state: "configured", passwordVerified: null, note: "lubum", tunnelIp: "100.64.0.54", winboxPort: 13054, apiPort: 23054, publicKey: "", createdAt: "13/07/26 10:36", score: 73, antennas: ["Antenne F"] },
  { id: "r5", name: "Site Goma", protocol: "SSTP", ros: "v6", state: "configured", passwordVerified: null, note: "goma/+243 800 000 003", tunnelIp: "100.64.0.34", winboxPort: 13034, apiPort: 23034, publicKey: "", createdAt: "06/07/26 10:21", score: 70, antennas: ["Antenne G"] },
  { id: "r6", name: "Site Matadi", protocol: "SSTP", ros: "v6", state: "online", passwordVerified: true, note: "matadi", tunnelIp: "100.64.0.11", winboxPort: 13011, apiPort: 23011, publicKey: "", createdAt: "01/07/26 08:18", score: 81, antennas: ["Antenne H", "Antenne I"] },
  { id: "r7", name: "Site Kisangani", protocol: "SSTP", ros: "v6", state: "configured", passwordVerified: null, note: "kisa/+243 800 000 004", tunnelIp: "100.64.0.14", winboxPort: 13014, apiPort: 23014, publicKey: "", createdAt: "30/06/26 16:01", score: 51, antennas: [] },
  { id: "r8", name: "Site Kolwezi", protocol: "WireGuard", ros: "v7", state: "suspended", passwordVerified: null, note: "kolwezi/+243 800 000 005", tunnelIp: "100.65.0.6", winboxPort: 15054, apiPort: 25054, publicKey: "b/aLSz0O40cbvc…", createdAt: "15/10/12 07:32", score: 0, antennas: [], suspendedReason: "espace expiré le 22/11/2026" },
];

export interface Workstation {
  id: string;
  name: string;
  system: string;
  online: boolean;
  confirmation: boolean;
}

export const DEMO_WORKSTATIONS: Workstation[] = [
  { id: "w1", name: "PC Bureau", system: "Microsoft Windows 11 Professionnel - 25H2/26200", online: false, confirmation: true },
  { id: "w2", name: "PC Caisse", system: "Microsoft Windows 11 Professionnel - 25H2/26200", online: false, confirmation: true },
  { id: "w3", name: "Laptop Technicien", system: "Microsoft Windows 10 Professionnel - 22H2/19045", online: false, confirmation: true },
];

export interface VpnPack {
  routers: number;
  period: string;
  daysLeft: string;
  tone: "red" | "green";
  via: string;
  expires: string;
}

export const DEMO_PACKS: VpnPack[] = [
  { routers: 1, period: "Mensuel", daysLeft: "3 j 17h", tone: "red", via: "Money Fusion", expires: "28/11/2026" },
  { routers: 1, period: "Mensuel", daysLeft: "11 jours", tone: "green", via: "Money Fusion", expires: "06/12/2026" },
  { routers: 1, period: "Mensuel", daysLeft: "15 jours", tone: "green", via: "Solde interne", expires: "10/12/2026" },
  { routers: 3, period: "Mensuel", daysLeft: "15 jours", tone: "green", via: "Solde interne", expires: "10/12/2026" },
  { routers: 2, period: "Mensuel", daysLeft: "21 jours", tone: "green", via: "Solde interne", expires: "16/12/2026" },
];

export interface PackHistory {
  date: string;
  routers: number;
  period: string;
  amount: string;
  via: string;
  expires: string;
  state: "Actif" | "Expiré";
}

export const DEMO_HISTORY: PackHistory[] = [
  { date: "16/11/2026", routers: 1, period: "Mensuel", amount: "1 951 CDF", via: "Solde interne", expires: "16/12/2026", state: "Actif" },
  { date: "16/11/2026", routers: 2, period: "Mensuel", amount: "3 901 CDF", via: "Solde interne", expires: "16/12/2026", state: "Actif" },
  { date: "10/11/2026", routers: 3, period: "Mensuel", amount: "5 913 CDF", via: "Solde interne", expires: "10/12/2026", state: "Actif" },
  { date: "06/11/2026", routers: 1, period: "Mensuel", amount: "500 FCFA", via: "Money Fusion", expires: "06/12/2026", state: "Actif" },
  { date: "12/10/2026", routers: 1, period: "Mensuel", amount: "1 978 CDF", via: "FlexPay", expires: "12/11/2026", state: "Expiré" },
  { date: "02/10/2026", routers: 2, period: "Mensuel", amount: "1 000 FCFA", via: "Money Fusion", expires: "02/11/2026", state: "Expiré" },
  { date: "12/09/2026", routers: 1, period: "Mensuel", amount: "Gratuit", via: "Manuel (admin)", expires: "12/10/2026", state: "Expiré" },
  { date: "01/09/2026", routers: 1, period: "Mensuel", amount: "Gratuit", via: "Offert (bienvenue)", expires: "02/10/2026", state: "Expiré" },
];

export const SERVER = {
  endpoint: "vpn.fluxionwifi.tech",
  tunnelCidr: "100.64.0.0/16",
  serverIp: "100.64.0.1",
  wgCidr: "100.65.0.0/16",
  wgServerIp: "100.65.0.1",
  wgPort: 443,
  wgInterface: "wg0",
  sstpPort: 443,
};

export const DEMO_ANTENNA_COUNT = DEMO_ROUTERS.reduce((n, r) => n + r.antennas.length, 0);
