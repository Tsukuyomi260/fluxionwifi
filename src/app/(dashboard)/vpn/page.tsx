"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useVpn } from "@/hooks/use-vpn";
import { AddRouterWizard } from "@/components/vpn/add-router-wizard";
import { TopologyPanel } from "@/components/vpn/topology-panel";
import {
  AffiliationTab,
  HelpTab,
  PageTitle,
  RoutersVpnTab,
  ServerTab,
  SubscriptionTab,
  WorkstationsTab,
} from "@/components/vpn/vpn-tabs";
import { DEMO_ROUTERS, DEMO_WORKSTATIONS, type VpnRouterRow } from "@/lib/vpn-data";
import type { VpnTunnel } from "@/lib/supabase/types";
import {
  Activity,
  BookOpen,
  CreditCard,
  HelpCircle,
  Loader2,
  LogOut,
  Menu,
  Monitor,
  Network,
  Plus,
  RefreshCw,
  Server,
  Shield,
  Share2,
  User,
} from "lucide-react";

type Tab =
  | "overview"
  | "server"
  | "add-router"
  | "routers-vpn"
  | "workstations"
  | "subscription"
  | "affiliation"
  | "help";

const TEAL = "#17A2B8";
const ACTIVE_SPACES = 10; // espaces débloqués (démo, remplacé par l'abonnement au backend)

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fromTunnel(t: VpnTunnel): VpnRouterRow {
  const wg = t.protocol === "WireGuard";
  const last = parseInt((t.local_ip || "").split(".").pop() || "0", 10) || 0;
  const d = new Date(t.created_at);
  return {
    id: t.id,
    name: t.name,
    protocol: wg ? "WireGuard" : "SSTP",
    ros: "v7",
    state: t.status === "connected" ? "online" : "configured",
    passwordVerified: null,
    note: t.router?.name || "",
    tunnelIp: t.local_ip || "—",
    winboxPort: (wg ? 15000 : 13000) + last,
    apiPort: (wg ? 25000 : 23000) + last,
    publicKey: t.public_key || "",
    createdAt: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`,
    score: t.status === "connected" ? 80 : 50,
    antennas: [],
  };
}

export default function VpnPage() {
  const { tunnels, loading, addTunnel, deleteTunnel, refetch } = useVpn();
  const [tab, setTab] = useState<Tab>("overview");
  const [nav, setNav] = useState(false);

  const demo = tunnels.length === 0;
  const rows = useMemo<VpnRouterRow[]>(() => (demo ? DEMO_ROUTERS : tunnels.map(fromTunnel)), [demo, tunnels]);
  const workstations = demo ? DEMO_WORKSTATIONS : [];

  const items: { key: Tab; label: string; icon: typeof Shield; section?: string; badge?: { text: string | number; cls: string } }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: Activity },
    { key: "server", label: "Serveur VPN (VPS)", icon: Server, section: "CONFIGURATION" },
    { key: "add-router", label: "Ajouter un routeur", icon: Plus },
    { key: "routers-vpn", label: "Routeurs VPN", icon: Network, section: "PARC" },
    { key: "workstations", label: "Postes de travail", icon: Monitor, badge: { text: workstations.length, cls: "bg-[#17A2B8]" } },
    {
      key: "subscription",
      label: "Abonnement",
      icon: CreditCard,
      section: "ABONNEMENT",
      badge: { text: `${rows.length}/${ACTIVE_SPACES}`, cls: rows.length > ACTIVE_SPACES ? "bg-red-500" : "bg-[#17A2B8]" },
    },
    { key: "affiliation", label: "Affiliation", icon: Share2, section: "PARRAINAGE" },
    { key: "help", label: "Aide", icon: HelpCircle },
  ];

  function go(t: Tab) {
    setTab(t);
    setNav(false);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: TEAL }} />
      </div>
    );
  }

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] bg-[#F4F6F9] text-slate-800 lg:-m-6">
      {nav && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setNav(false)} />}

      {/* Menu latéral */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[250px] shrink-0 overflow-y-auto bg-[#222D3C] text-slate-300 transition-transform lg:static lg:z-auto lg:translate-x-0 ${
          nav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-4 text-[24px] font-semibold tracking-wide text-white">
          FLUXION <span style={{ color: TEAL }}>VPN</span>
        </div>
        <nav className="p-2 pb-6">
          {items.map((it) => (
            <div key={it.key}>
              {it.section && <p className="px-3 pb-1 pt-5 text-[16px] font-medium uppercase text-slate-300">{it.section}</p>}
              <button
                onClick={() => go(it.key)}
                className={`flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-left text-[17px] transition-colors ${
                  tab === it.key ? "text-white" : "text-slate-300 hover:bg-white/5"
                }`}
                style={tab === it.key ? { background: TEAL } : undefined}
              >
                <it.icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 truncate">{it.label}</span>
                {it.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[12px] font-bold leading-none text-white ${it.badge.cls}`}>{it.badge.text}</span>
                )}
              </button>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barre du haut */}
        <header className="flex h-14 shrink-0 items-center justify-between px-4 text-white" style={{ background: TEAL }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setNav(true)} className="lg:hidden" aria-label="Menu"><Menu className="h-5 w-5" /></button>
            <Menu className="hidden h-5 w-5 lg:block" />
            <span className="flex items-center gap-2 text-[16px]"><Shield className="h-4 w-4" /> Tunnels multi-protocole</span>
          </div>
          <div className="flex items-center gap-4">
            {demo && <span className="hidden rounded bg-white/20 px-2 py-0.5 text-[11px] font-semibold sm:inline">Données de démonstration</span>}
            <span className="flex items-center gap-2 text-[16px]"><User className="h-4 w-4" /> FLUXIONWIFI</span>
            <button onClick={refetch} aria-label="Actualiser"><RefreshCw className="h-4 w-4" /></button>
            <Link href="/dashboard" aria-label="Quitter le VPN"><LogOut className="h-4 w-4" /></Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-5">
          {tab === "overview" && (
            <div>
              <TopologyPanel
                routers={rows.map((r) => ({ id: r.id, name: r.name, state: r.state, score: r.score, antennas: r.antennas }))}
                workstations={workstations.length}
                onRefresh={refetch}
              />
              <p className="mt-4 text-center">
                <button onClick={() => go("help")} className="inline-flex items-center gap-2 text-[14px] hover:underline" style={{ color: TEAL }}>
                  <BookOpen className="h-4 w-4" /> Consulter le guide complet FLUXION VPN
                </button>
              </p>
            </div>
          )}

          {tab === "server" && <ServerTab />}

          {tab === "add-router" && (
            <div>
              <PageTitle>Ajouter un routeur</PageTitle>
              <AddRouterWizard
                serverHost="vpn.fluxionwifi.tech"
                onCreate={async (r) => {
                  const res = await addTunnel({
                    name: r.name,
                    protocol: r.protocol,
                    server_ip: r.serverHost,
                    port: r.port,
                    router_id: null,
                  } as Partial<VpnTunnel>);
                  if (res?.error) throw new Error(res.error);
                }}
                onDone={() => go("routers-vpn")}
              />
            </div>
          )}

          {tab === "routers-vpn" && (
            <RoutersVpnTab
              rows={rows}
              onAdd={() => go("add-router")}
              onDelete={demo ? undefined : (id) => deleteTunnel(id)}
              onRefresh={refetch}
            />
          )}

          {tab === "workstations" && <WorkstationsTab items={workstations} />}
          {tab === "subscription" && <SubscriptionTab active={ACTIVE_SPACES} used={rows.length} />}
          {tab === "affiliation" && <AffiliationTab />}
          {tab === "help" && <HelpTab />}
        </main>

        <footer className="border-t border-slate-200 bg-white px-5 py-3 text-[13px] text-slate-500">
          <b className="text-slate-700">FLUXIONWIFI</b> — Gestion VPN multi-protocole · API : <code className="font-mono text-slate-600">https://fluxionwifi.tech</code>
        </footer>
      </div>
    </div>
  );
}
