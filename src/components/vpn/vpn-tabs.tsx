"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  ClipboardCopy,
  Copy,
  ExternalLink,
  HeartPulse,
  HelpCircle,
  Hourglass,
  Info,
  Layers,
  List,
  Loader2,
  Lock,
  MoreVertical,
  Monitor,
  Network,
  Plus,
  RefreshCw,
  Server,
  Share2,
  DoorOpen,
  Terminal,
  Wrench,
  Gauge,
} from "lucide-react";
import {
  DEMO_HISTORY,
  DEMO_PACKS,
  SERVER,
  type VpnRouterRow,
  type Workstation,
} from "@/lib/vpn-data";

const TEAL = "#17A2B8";

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-[28px] font-medium leading-tight text-slate-800">{children}</h2>;
}

function Card({ children, top, className = "" }: { children: React.ReactNode; top?: boolean; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[3px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] ${className}`}
      style={top ? { borderTop: `3px solid ${TEAL}` } : undefined}
    >
      {children}
    </div>
  );
}

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  function show(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(null), 3000);
  }
  const node = msg ? (
    <div className="fixed right-4 top-16 z-[60] rounded-[3px] px-5 py-3 text-sm font-medium text-white shadow-lg" style={{ background: TEAL }}>
      {msg}
    </div>
  ) : null;
  return { show, node };
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* presse-papiers indisponible */
  }
}

/* ───────────── Serveur VPN (VPS) ───────────── */

const field = "h-[38px] w-full rounded-[3px] border border-slate-300 bg-slate-100 px-3 text-[15px] text-slate-600";
const flabel = "mb-1.5 block text-[15px] font-semibold text-slate-700";
const fhint = "mt-1 text-xs text-slate-500";

const VPS_SCRIPT = `# 1) Générer la paire de clés du serveur (une seule fois) :
   wg genkey | tee /etc/wireguard/server_private.key | wg pubkey | tee /etc/wireguard/server_public.key
   # → collez la clé PUBLIQUE affichée dans le champ « Clé publique du serveur ».

# 2) /etc/wireguard/wg0.conf :
[Interface]
Address = ${SERVER.wgServerIp}/16
ListenPort = 51820
PrivateKey = <CONTENU DE server_private.key>

# 3) Activer le service et ouvrir le port UDP :
   wg-quick up wg0
   systemctl enable wg-quick@wg0
   ufw allow 51820/udp # (ou votre pare-feu)

# 4) Seconde porte sur UDP 443 — indispensable là où le FAI ne laisse
# passer que 80/443. WireGuard continue d'écouter sur 51820 ; on ne fait
# qu'ouvrir un second accès vers la MÊME socket (bloc *nat de before.rules) :
# *nat
# :PREROUTING ACCEPT [0:0]
# -A PREROUTING -p udp --dport 443 -j REDIRECT --to-ports 51820
# COMMIT
   ufw allow 443/udp

# → endpoint à composer par les routeurs : ${SERVER.endpoint}:443`;

export function ServerTab() {
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  function refreshKey() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.show("Connexion au VPS indisponible : aucune clé récupérée.");
    }, 900);
  }

  return (
    <div>
      {toast.node}
      <PageTitle>Serveur VPN (VPS)</PageTitle>

      <div className="mb-5 rounded-[3px] border border-slate-200 bg-white px-4 py-3 text-[14px] leading-relaxed text-slate-600">
        <Lock className="mr-2 inline h-3.5 w-3.5 text-slate-700" />
        Paramètres du <b>serveur VPN</b> du VPS, communs à <b>tous les clients</b> (un seul VPS physique, une seule configuration réseau). Ils sont définis et maintenus par l&apos;administration FLUXIONWIFI — <b>lecture seule</b> depuis ce compte, enregistrés automatiquement dès que nécessaire.
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card top>
          <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 text-lg text-slate-700">
            <Server className="h-5 w-5" /> Paramètres communs
          </div>
          <div className="space-y-5 p-5">
            <div>
              <label className={flabel}>Adresse publique du VPS (endpoint) <span className="text-red-500">*</span></label>
              <input readOnly value={SERVER.endpoint} className={field} />
              <p className={fhint}>Hôte fixe du VPS FLUXIONWIFI (non modifiable).</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={flabel}>Sous-réseau du tunnel (CIDR) <span className="text-red-500">*</span></label>
                <input readOnly value={SERVER.tunnelCidr} className={field} />
              </div>
              <div>
                <label className={flabel}>IP du serveur</label>
                <input readOnly value={SERVER.serverIp} className={field} />
              </div>
            </div>

            <hr className="border-slate-200" />

            <div>
              <p className="mb-3 text-[15px] font-semibold text-slate-500">
                <span className="mr-1">⚡</span> WireGuard <span className="font-normal">(uniquement si vous utilisez WireGuard)</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={flabel}>Sous-réseau WireGuard (CIDR)</label>
                  <input readOnly value={SERVER.wgCidr} className={field} />
                  <p className={fhint}>Réseau séparé des tunnels PPP (évite tout conflit de routage).</p>
                </div>
                <div>
                  <label className={flabel}>IP serveur WG</label>
                  <input readOnly value={SERVER.wgServerIp} className={field} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className={flabel}>Port UDP composé par les routeurs</label>
                  <input readOnly value={SERVER.wgPort} className={field} />
                </div>
                <div>
                  <label className={flabel}>Interface serveur</label>
                  <input readOnly value={SERVER.wgInterface} className={field} />
                </div>
              </div>
              <div className="mt-4">
                <label className={flabel}>
                  Clé publique du serveur <span className="text-xs font-normal text-slate-500">(requise seulement pour WireGuard)</span>
                </label>
                <div className="flex">
                  <input readOnly placeholder="Générée au premier lancement du serveur" className={`${field} rounded-r-none font-mono text-[13px]`} />
                  <button
                    onClick={refreshKey}
                    className="flex h-[38px] shrink-0 items-center gap-2 rounded-r-[3px] border bg-white px-4 text-[15px] hover:bg-slate-50"
                    style={{ borderColor: TEAL, color: TEAL }}
                  >
                    {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Actualiser depuis le VPS
                  </button>
                </div>
                <p className={fhint}>
                  Récupérée et tenue à jour automatiquement depuis le VPS (nécessite <code className="rounded bg-slate-100 px-1 font-mono">install-wireguard.sh</code> lancé sur le serveur).
                </p>
              </div>
            </div>

            <hr className="border-slate-200" />

            <div>
              <p className="mb-3 text-[15px] font-semibold text-slate-500">
                <Lock className="mr-1.5 inline h-3.5 w-3.5" /> SSTP / L2TP / PPTP <span className="font-normal">(serveur accel-ppp)</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={flabel}>Port SSTP</label>
                  <input readOnly value={SERVER.sstpPort} className={field} />
                  <p className={fhint}>443 = pris par Nginx → 4443.</p>
                </div>
                <div>
                  <label className={flabel}>Secret IPsec L2TP <span className="text-xs font-normal text-slate-500">(partagé)</span></label>
                  <input readOnly placeholder="Fourni par l'administrateur" className={field} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 rounded-[3px] border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Besoin d&apos;un changement sur ces paramètres (nouveau sous-réseau, port, etc.) ? Contactez l&apos;administration FLUXIONWIFI.
            </div>
          </div>
        </Card>

        <Card className="self-start">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <span className="flex items-center gap-2 text-lg text-slate-700">
              <Terminal className="h-5 w-5" /> Mise en place côté VPS
            </span>
            <button
              onClick={() => {
                copy(VPS_SCRIPT);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Copier le script"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <ClipboardCopy className="h-4 w-4" />}
            </button>
          </div>
          <div className="p-5">
            <pre className="max-h-[420px] overflow-auto rounded-[3px] bg-[#0F172A] p-4 font-mono text-[13px] leading-[1.7] text-slate-100">{VPS_SCRIPT}</pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ───────────── Routeurs VPN ───────────── */

function StateCell({ r }: { r: VpnRouterRow }) {
  if (r.state === "suspended")
    return (
      <div className="text-[13px] leading-snug text-red-600">
        <span className="font-semibold">Suspendu</span> — {r.suspendedReason}
      </div>
    );
  const on = r.state === "online";
  return (
    <span className="inline-flex items-center gap-1.5 text-[15px] text-slate-700">
      <span className={`h-2.5 w-2.5 rounded-full ${on ? "bg-emerald-500" : "bg-slate-400"}`} />
      {on ? "En ligne" : "Configuré"}
    </span>
  );
}

export function RoutersVpnTab({
  rows,
  onAdd,
  onDelete,
  onRefresh,
}: {
  rows: VpnRouterRow[];
  onAdd: () => void;
  onDelete?: (id: string) => void;
  onRefresh: () => void;
}) {
  const [menu, setMenu] = useState<string | null>(null);
  const toast = useToast();

  const tb = "inline-flex h-9 items-center gap-2 rounded-[3px] border bg-white px-3 text-[14px] transition-colors hover:bg-slate-50";

  function details(r: VpnRouterRow) {
    return [
      `Routeur : ${r.name}`,
      `Protocole : ${r.protocol} (RouterOS ${r.ros})`,
      `IP tunnel : ${r.tunnelIp}`,
      `WinBox : ${SERVER.endpoint}:${r.winboxPort}`,
      `API (MikHmon local) : ${SERVER.endpoint}:${r.apiPort}`,
    ].join("\n");
  }

  return (
    <div>
      {toast.node}
      <PageTitle>Routeurs VPN</PageTitle>
      <Card>
        <div className="flex flex-wrap items-center gap-2 px-4 py-4">
          <span className="mr-2 flex items-center gap-2 text-xl text-slate-700">
            <Network className="h-5 w-5" /> Routeurs
            <span className="rounded bg-slate-500 px-2 py-0.5 text-xs font-bold text-white">{rows.length}</span>
          </span>
          <button className={`${tb} border-slate-300 text-slate-600`} onClick={() => toast.show("État des routeurs vérifié.")}>
            <HeartPulse className="h-4 w-4" /> Vérifier l&apos;état
          </button>
          <button className={`${tb} border-amber-400 text-amber-600`} onClick={() => toast.show(`Passerelles WinBox/API réouvertes (${rows.length}/${rows.length}).`)}>
            <Wrench className="h-4 w-4" /> Réparer les passerelles
          </button>
          <button className={`${tb} border-emerald-500 text-emerald-600`} onClick={() => toast.show("MikHmon s'ouvre depuis le tableau de bord principal.")}>
            <Gauge className="h-4 w-4" /> Ouvrir MikHmon
          </button>
          <button className={`${tb}`} style={{ borderColor: "#3B82F6", color: "#2563EB" }} onClick={() => toast.show("Aucune antenne à afficher pour l'instant.")}>
            <List className="h-4 w-4" /> Toutes les antennes
          </button>
          <button onClick={onAdd} className="inline-flex h-9 items-center gap-2 rounded-[3px] px-3 text-[14px] font-medium text-white" style={{ background: TEAL }}>
            <Plus className="h-4 w-4" /> Ajouter
          </button>
          <button onClick={onRefresh} className="p-1.5 text-slate-400 hover:text-slate-600" aria-label="Actualiser">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="bg-slate-200 text-[15px] font-semibold text-slate-700">
                <th className="px-3 py-4">État</th>
                <th className="px-3 py-4">Nom</th>
                <th className="px-3 py-4">IP tunnel</th>
                <th className="px-3 py-4">Clé publique</th>
                <th className="px-3 py-4">Créé le</th>
                <th className="px-3 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-200 align-top">
                  <td className="px-3 py-4"><StateCell r={r} /></td>
                  <td className="px-3 py-4">
                    <p className="text-[15px] font-semibold text-slate-800">
                      {r.name}{" "}
                      <span className="rounded px-1.5 py-0.5 text-[11px] font-bold text-white" style={{ background: TEAL }}>{r.protocol}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-700">{r.ros}</span>
                      {r.passwordVerified === true && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          <Check className="h-3 w-3" /> Mot de passe vérifié
                        </span>
                      )}
                      {r.passwordVerified === null && r.state !== "suspended" && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">Vérification impossible</span>
                      )}
                    </div>
                    {r.note && <p className="mt-1 text-xs text-slate-500">{r.note}</p>}
                  </td>
                  <td className="px-3 py-4 font-mono text-[13px] leading-relaxed text-slate-500">
                    <p className="text-[15px] font-bold text-slate-800">{r.tunnelIp}</p>
                    <p>WinBox : {SERVER.endpoint}:{r.winboxPort}</p>
                    <p>API (MikHmon local) : {SERVER.endpoint}:{r.apiPort}</p>
                  </td>
                  <td className="px-3 py-4 font-mono text-xs text-amber-500">{r.publicKey || "—"}</td>
                  <td className="px-3 py-4 text-[13px] text-slate-600">{r.createdAt}</td>
                  <td className="relative px-3 py-4">
                    {r.state === "suspended" ? (
                      <button className="rounded-[3px] bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => toast.show("Renouvellement : onglet Abonnement.")}>
                        Renouveler cet espace
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setMenu(menu === r.id ? null : r.id)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Actions">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {menu === r.id && (
                          <div className="absolute right-3 top-12 z-20 w-72 rounded-[3px] border border-slate-200 bg-white py-1 text-sm shadow-lg">
                            {[
                              { label: "Revoir / télécharger la config", run: () => toast.show("La configuration (.rsc) sera régénérée avec le serveur.") },
                              { label: "Copier l'adresse WinBox", run: () => { copy(`${SERVER.endpoint}:${r.winboxPort}`); toast.show("Adresse WinBox copiée."); } },
                              { label: "Copier l'adresse API (MikHmon local)", run: () => { copy(`${SERVER.endpoint}:${r.apiPort}`); toast.show("Adresse API copiée."); } },
                              { label: "Copier tous les détails (incl. lien MikHmon)", run: () => { copy(details(r)); toast.show("Détails copiés."); } },
                              { label: "Identifiants MikHmon", run: () => toast.show("Les identifiants MikHmon s'affichent depuis le serveur.") },
                              { label: "Renommer", run: () => toast.show("Le renommage sera enregistré avec le backend.") },
                              { label: "Désactiver", run: () => toast.show("La désactivation sera appliquée avec le backend.") },
                            ].map((a) => (
                              <button key={a.label} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setMenu(null); a.run(); }}>
                                <Copy className="h-4 w-4 text-slate-400" /> {a.label}
                              </button>
                            ))}
                            {onDelete && (
                              <button
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
                                onClick={() => { setMenu(null); onDelete(r.id); }}
                              >
                                <AlertTriangle className="h-4 w-4" /> Supprimer
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-slate-500">Aucun routeur : cliquez sur « Ajouter ».</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ───────────── Postes de travail ───────────── */

export function WorkstationsTab({ items }: { items: Workstation[] }) {
  const [conf, setConf] = useState<Record<string, boolean>>({});
  const toast = useToast();
  return (
    <div>
      {toast.node}
      <PageTitle>Postes de travail</PageTitle>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2 text-xl text-slate-700">
            <Monitor className="h-5 w-5" /> Mes postes
            <span className="rounded bg-slate-500 px-2 py-0.5 text-xs font-bold text-white">{items.length}</span>
          </span>
          <div className="flex items-center gap-3">
            <button className="inline-flex h-9 items-center gap-2 rounded-[3px] px-4 text-[14px] font-medium text-white" style={{ background: TEAL }} onClick={() => toast.show("L'agent FLUXIONWIFI sera disponible au téléchargement avec le backend.")}>
              <Plus className="h-4 w-4" /> Ajouter un ordinateur
            </button>
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        <p className="border-t border-slate-200 px-5 py-2 text-[13px] text-slate-500">
          Un poste est un ordinateur sur lequel vous installez l&apos;agent FLUXIONWIFI. Contrairement à un routeur, il n&apos;a pas besoin de tunnel : l&apos;agent se connecte tout seul, où que soit la machine.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-slate-200 text-[15px] font-semibold text-slate-700">
                <th className="px-5 py-3.5">État</th>
                <th className="px-3 py-3.5">Nom</th>
                <th className="px-3 py-3.5">Système</th>
                <th className="px-3 py-3.5">Confirmation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((w) => {
                const on = conf[w.id] ?? w.confirmation;
                return (
                  <tr key={w.id} className="border-b border-slate-200">
                    <td className="px-5 py-3.5 text-[13px] text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${w.online ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {w.online ? "En ligne" : <span className="leading-tight">Hors<br />ligne</span>}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-[15px] font-bold uppercase text-slate-800">{w.name}</td>
                    <td className="px-3 py-3.5 text-[13px] text-slate-500">{w.system}</td>
                    <td className="px-3 py-3.5">
                      <label className="flex cursor-pointer items-center gap-2 text-[13px] font-bold text-slate-700">
                        <button
                          role="switch"
                          aria-checked={on}
                          onClick={() => setConf((c) => ({ ...c, [w.id]: !on }))}
                          className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-blue-600" : "bg-slate-300"}`}
                        >
                          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
                        </button>
                        {on ? "Demandée" : "Non requise"}
                      </label>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex h-9 items-center gap-2 rounded-[3px] bg-[#5BC0D6] px-4 text-[14px] font-medium text-white disabled:opacity-60" disabled={!w.online} title={w.online ? "" : "Poste hors ligne"}>
                          <Monitor className="h-4 w-4" /> Contrôler
                        </button>
                        <button className="flex h-9 w-8 items-center justify-center rounded-[3px] border border-slate-300 text-slate-600" aria-label="Plus d'actions">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ───────────── Abonnement & espaces ───────────── */

export function SubscriptionTab({ active, used }: { active: number; used: number }) {
  const toast = useToast();
  const free = Math.max(active - used, 0);
  const stats = [
    { label: "Espaces actifs", value: active, color: "#7C3AED", icon: Layers },
    { label: "Espaces utilisés", value: used, color: "#0EA5E9", icon: Network },
    { label: "Espaces libres", value: free, color: "#10B981", icon: DoorOpen },
    { label: "Prochaine expiration", value: "28/11/2026", color: "#F59E0B", icon: Hourglass },
  ];
  return (
    <div>
      {toast.node}
      <PageTitle>Abonnement &amp; espaces</PageTitle>

      <Card className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
          <div>
            <p className="flex items-center gap-2 text-xl text-slate-700"><DoorOpen className="h-5 w-5" style={{ color: TEAL }} /> Espaces routeurs</p>
            <p className="mt-1 text-[14px] text-slate-500">Chaque espace débloqué vous permet d&apos;ajouter un routeur. Chaque pack a sa propre date d&apos;expiration.</p>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-[3px] bg-[#28A745] px-5 text-[15px] font-medium text-white" onClick={() => toast.show("Le paiement des espaces sera branché avec FlexPay / Moneroo.")}>
            <DoorOpen className="h-4 w-4" /> Débloquer des espaces
          </button>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex overflow-hidden rounded-[3px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              <div className="flex w-[70px] items-center justify-center" style={{ background: s.color }}>
                <s.icon className="h-8 w-8 text-white" />
              </div>
              <div className="px-4 py-3">
                <p className="text-[14px] text-slate-700">{s.label}</p>
                <p className="text-[18px] font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-5">
        <p className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 text-lg text-slate-700">
          <Layers className="h-5 w-5" /> Packs actifs
        </p>
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {DEMO_PACKS.map((p, i) => (
            <div key={i} className="relative rounded-[3px] border border-slate-200 p-3">
              <button className="absolute right-3 top-3 flex h-7 w-8 items-center justify-center rounded border border-emerald-500 text-emerald-600" aria-label="Renouveler" onClick={() => toast.show("Renouvellement : paiement à venir.")}>
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <p><span className="text-xl font-bold text-violet-700">{p.routers}</span> <span className="text-[13px] text-slate-500">{p.routers > 1 ? "routeurs" : "routeur"}</span></p>
              <p className="mt-1 flex items-center gap-2 text-[13px] font-bold text-slate-800">
                {p.period}
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold text-white ${p.tone === "red" ? "bg-amber-500" : "bg-emerald-500"}`}>{p.daysLeft}</span>
              </p>
              <p className="mt-1 text-[13px] text-slate-500">{p.via} · expire le {p.expires}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 text-lg text-slate-700">
          <List className="h-5 w-5" /> Historique
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="bg-slate-100 font-semibold text-slate-700">
                {["Date", "Pack", "Période", "Montant", "Moyen", "Expire", "État"].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_HISTORY.map((h, i) => (
                <tr key={i} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-2.5">{h.date}</td>
                  <td className="px-4 py-2.5">{h.routers} rt</td>
                  <td className="px-4 py-2.5">{h.period}</td>
                  <td className="px-4 py-2.5">{h.amount}</td>
                  <td className="px-4 py-2.5">{h.via}</td>
                  <td className="px-4 py-2.5">{h.expires}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-bold text-white ${h.state === "Actif" ? "bg-emerald-500" : "bg-slate-400"}`}>{h.state}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ───────────── Affiliation & parrainage ───────────── */

export function AffiliationTab() {
  const [copied, setCopied] = useState(false);
  const link = "https://fluxionwifi.tech/register?ref=FLUX-DEMO";
  const tiles = [
    { v: "0 FCFA", l: "Gains totaux", c: "#10B981" },
    { v: "0 FCFA", l: "Disponible", c: "#10B981" },
    { v: "0 FCFA", l: "Retraits en cours", c: "#F59E0B" },
    { v: "2", l: "Filleuls", c: "#0F172A" },
  ];
  return (
    <div>
      <PageTitle>Affiliation &amp; parrainage</PageTitle>
      <Card>
        <div className="flex items-center gap-2 px-5 py-3.5 text-lg font-medium text-white" style={{ background: TEAL }}>
          <Share2 className="h-5 w-5" /> Parrainage FLUXION VPN — gagnez 10% sur chaque paiement de vos filleuls
        </div>
        <div className="p-5">
          <p className="text-[14px] leading-relaxed text-slate-500">
            Partagez votre lien : toute personne qui crée son compte FLUXION VPN via ce lien devient votre <b>filleul</b>. Chacun de ses paiements (packs de routeurs, espaces antennes…) vous rapporte automatiquement une commission — exactement comme sur les autres services FLUXIONWIFI.
          </p>
          <p className="mb-1.5 mt-4 text-[13px] font-bold text-slate-800">Votre lien de parrainage</p>
          <div className="flex">
            <input readOnly value={link} className="h-[38px] w-full rounded-l-[3px] border border-slate-300 bg-slate-100 px-3 text-[14px] text-slate-700" />
            <button
              className="flex h-[38px] shrink-0 items-center gap-2 px-4 text-[14px] text-white"
              style={{ background: TEAL }}
              onClick={() => { copy(link); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copié" : "Copier"}
            </button>
            <a
              className="flex h-[38px] w-10 shrink-0 items-center justify-center rounded-r-[3px] border border-slate-300 text-slate-600 hover:bg-slate-50"
              href={`https://wa.me/?text=${encodeURIComponent(link)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Partager sur WhatsApp"
            >
              <Share2 className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {tiles.map((t) => (
              <div key={t.l} className="rounded-[3px] border border-slate-200 px-3 py-4 text-center">
                <p className="text-[20px] font-bold" style={{ color: t.c }}>{t.v}</p>
                <p className="text-[13px] text-slate-500">{t.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 rounded-[3px] border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Les retraits, l&apos;historique détaillé des commissions et la liste de vos filleuls se gèrent dans l&apos;<b>Espace Affiliation</b> commun à tous les services FLUXIONWIFI.
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/account" className="inline-flex h-10 items-center gap-2 rounded-[3px] px-5 text-[15px] text-white" style={{ background: TEAL }}>
              <ExternalLink className="h-4 w-4" /> Gérer mes retraits (Espace Affiliation)
            </a>
            <button className="inline-flex h-10 items-center gap-2 rounded-[3px] border border-slate-400 px-5 text-[15px] text-slate-700 hover:bg-slate-50">
              <RefreshCw className="h-4 w-4" /> Actualiser
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ───────────── Aide ───────────── */

export function HelpTab() {
  const steps = [
    <><b>Serveur VPN (VPS)</b> — générez la paire de clés du serveur une seule fois, renseignez l&apos;endpoint public, le port UDP, le sous-réseau du tunnel et collez la <b>clé publique</b> du serveur.</>,
    <><b>Ajouter un routeur</b> — laissez le routeur générer ses clés (recommandé). La page attribue une IP de tunnel et produit un script <code className="rounded bg-slate-100 px-1 font-mono">.rsc</code> pour RouterOS v7+.</>,
    <><b>Sur le routeur</b> — importez le <code className="rounded bg-slate-100 px-1 font-mono">.rsc</code>. Le routeur affiche sa <b>clé publique</b> ; collez-la dans l&apos;onglet « Côté serveur » (ou activez le renvoi automatique).</>,
    <><b>Sur le VPS</b> — ajoutez le pair avec la commande <code className="rounded bg-slate-100 px-1 font-mono">wg set</code> fournie. Le tunnel monte ; le routeur devient joignable sur son IP de tunnel (Winbox/API via le tunnel).</>,
  ];
  return (
    <div>
      <PageTitle>Aide</PageTitle>
      <Card>
        <p className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 text-xl text-slate-800">
          <HelpCircle className="h-5 w-5" style={{ color: TEAL }} /> <b className="font-semibold">Comment ça marche</b>
        </p>
        <div className="p-5">
          <ol className="list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-slate-700">
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <div className="mt-4 rounded-[3px] bg-amber-100 px-4 py-3 text-[14px] text-slate-800">
            <AlertTriangle className="mr-2 inline h-4 w-4 text-amber-600" />
            WireGuard nécessite <b>RouterOS v7</b>. Sur v6, mettez à jour le routeur au préalable.
          </div>
          <div className="mt-3 rounded-[3px] bg-blue-600 px-4 py-3 text-[14px] leading-relaxed text-white">
            <ExternalLink className="mr-2 inline h-4 w-4" />
            <b>Accès WinBox distant.</b> Pour chaque routeur, le VPS ouvre un port public dédié, dérivé de l&apos;IP de tunnel (le numéro exact est affiché sur la fiche du routeur et dans « Copier tous les détails »), qui relaie vers WinBox. L&apos;administrateur se connecte à {SERVER.endpoint}:&lt;port&gt; depuis n&apos;importe quel réseau, sans VPN sur son PC. Pensez à autoriser le tunnel côté routeur : <code className="font-mono">/ip service set winbox address=&lt;sous-réseau du tunnel&gt;,&lt;votre-LAN&gt;</code>, à utiliser des mots de passe forts et à garder RouterOS à jour.
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
            Intégrations serveur optionnelles : POST /api/vpn/register (le routeur renvoie sa clé), POST /api/vpn/peer (ajout/retrait du pair sur le VPS), POST /api/vpn/status (état réel), POST /api/vpn/gateway (accès WinBox). La page fonctionne sans elles, via les commandes manuelles fournies.
          </p>
        </div>
      </Card>
    </div>
  );
}

