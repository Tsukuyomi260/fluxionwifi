"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CircleDot,
  List,
  Maximize2,
  Minimize2,
  Minus,
  Monitor,
  Moon,
  Plus,
  RefreshCw,
  Scan,
  Sun,
  Trophy,
  Wand2,
  Wifi,
  Link2,
  Network,
  Radio,
} from "lucide-react";

export interface TopoRouter {
  id: string;
  name: string;
  state: "online" | "configured" | "suspended";
  score: number;
  antennas: string[];
}

type View = "force" | "radial" | "orbital" | "tree" | "groups" | "free";
type Theme = "dark" | "light";
type Pos = { x: number; y: number };

const VIEWS: { key: View; label: string; group: string }[] = [
  { key: "force", label: "Vue force-directed", group: "Schémas dynamiques" },
  { key: "radial", label: "Vue radiale", group: "Schémas dynamiques" },
  { key: "orbital", label: "Vue orbitale", group: "Schémas dynamiques" },
  { key: "tree", label: "Vue arborescente", group: "Schémas structurés" },
  { key: "groups", label: "Vue par groupes", group: "Schémas structurés" },
  { key: "free", label: "Vue libre — mon plan", group: "Plan personnalisé" },
];

const TEAL = "#17A2B8";
const W = 700;
const H = 460;
const CX = W / 2;
const CY = H / 2;
const MAX = 24;
const PLAN_KEY = "fluxion-topology-plan";
const THEME_KEY = "fluxion-topology-theme";

function ring(n: number, r: number, offset = 0): Pos[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2 + offset;
    return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r * 0.78 };
  });
}

function forceLayout(n: number): Pos[] {
  let seed = 11;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const pts = ring(n, 150).map((p) => ({ x: p.x + (rnd() - 0.5) * 70, y: p.y + (rnd() - 0.5) * 70 }));
  for (let it = 0; it < 140; it++) {
    for (let i = 0; i < n; i++) {
      let fx = (CX - pts[i].x) * 0.01;
      let fy = (CY - pts[i].y) * 0.012;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d2 = dx * dx + dy * dy + 1;
        fx += (dx / d2) * 1400;
        fy += (dy / d2) * 1400;
      }
      const dc = Math.hypot(pts[i].x - CX, pts[i].y - CY) || 1;
      if (dc < 110) { fx += ((pts[i].x - CX) / dc) * 3; fy += ((pts[i].y - CY) / dc) * 3; }
      pts[i].x = Math.min(W - 70, Math.max(70, pts[i].x + fx));
      pts[i].y = Math.min(H - 60, Math.max(60, pts[i].y + fy));
    }
  }
  return pts;
}

function layout(view: View, routers: TopoRouter[]) {
  const n = routers.length;
  const hub = { x: CX, y: CY };
  if (view === "force") return { pos: forceLayout(n), hub, extra: undefined as { label: string; x: number; y: number; w: number; h: number }[] | undefined };
  if (view === "radial" || view === "free") return { pos: ring(n, 175), hub, extra: undefined };
  if (view === "orbital") {
    const inner = routers.map((r, i) => ({ r, i })).filter((o) => o.r.state === "online");
    const outer = routers.map((r, i) => ({ r, i })).filter((o) => o.r.state !== "online");
    const pos: Pos[] = new Array(n);
    ring(inner.length, 110).forEach((p, k) => (pos[inner[k].i] = p));
    ring(outer.length, 185, 0.4).forEach((p, k) => (pos[outer[k].i] = p));
    return { pos, hub, extra: undefined };
  }
  if (view === "tree") {
    const perRow = 5;
    const rows = Math.ceil(n / perRow) || 1;
    const pos = routers.map((_, i) => {
      const row = Math.floor(i / perRow);
      const inRow = Math.min(perRow, n - row * perRow);
      const col = i % perRow;
      return { x: (W / (inRow + 1)) * (col + 1), y: 170 + row * (rows > 1 ? 140 : 0) + (rows > 1 ? 0 : 60) };
    });
    return { pos, hub: { x: CX, y: 60 }, extra: undefined };
  }
  const groups = [
    { label: "En ligne", test: (r: TopoRouter) => r.state === "online" },
    { label: "Configurés", test: (r: TopoRouter) => r.state === "configured" },
    { label: "Suspendus", test: (r: TopoRouter) => r.state === "suspended" },
  ].filter((g) => routers.some(g.test));
  const pos: Pos[] = new Array(n);
  const extra: { label: string; x: number; y: number; w: number; h: number }[] = [];
  const gw = W / Math.max(groups.length, 1);
  groups.forEach((g, gi) => {
    const items = routers.map((r, i) => ({ r, i })).filter((o) => g.test(o.r));
    extra.push({ label: g.label, x: gi * gw + 14, y: 100, w: gw - 28, h: 330 });
    items.forEach((o, k) => {
      pos[o.i] = { x: gi * gw + gw / 2 + (k % 2 === 0 ? -50 : 50), y: 160 + Math.floor(k / 2) * 80 };
    });
  });
  return { pos, hub: { x: CX, y: 50 }, extra };
}

function antennaPos(p: Pos, i: number, count: number): Pos {
  const base = -Math.PI / 2;
  const a = base + ((i + 1) / (count + 1) - 0.5) * Math.PI + (p.x < CX ? Math.PI * 0.6 : -Math.PI * 0.2);
  return { x: p.x + Math.cos(a) * 44, y: p.y + Math.sin(a) * 44 };
}

export function TopologyPanel({
  routers,
  workstations,
  onRefresh,
}: {
  routers: TopoRouter[];
  workstations: number;
  onRefresh?: () => void;
}) {
  const nodes = useMemo(() => routers.slice(0, MAX), [routers]);
  const [view, setView] = useState<View>("radial");
  const [theme, setTheme] = useState<Theme>("light");
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const [legend, setLegend] = useState(false);
  const [labels, setLabels] = useState(true);
  const [ago, setAgo] = useState(0);
  const [plan, setPlan] = useState<Record<string, Pos>>({});
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef<{ id: string; dx: number; dy: number } | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const t = localStorage.getItem(THEME_KEY);
        if (t === "light" || t === "dark") setTheme(t);
        const p = localStorage.getItem(PLAN_KEY);
        if (p) setPlan(JSON.parse(p));
      } catch {
        /* stockage indisponible */
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setAgo((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const { pos, hub, extra } = useMemo(() => layout(view, nodes), [view, nodes]);
  const at = (i: number): Pos => (view === "free" && plan[nodes[i].id]) || pos[i];

  const dark = theme === "dark";
  const c = dark
    ? { bg: "#0B1220", dot: "#1E2A44", line: TEAL, off: "#475569", on: "#065F46", offFill: "#1E293B", label: "#94A3B8", text: "#FFFFFF", group: "#111A2E", groupLine: "#1E2A44", ant: "#334155" }
    : { bg: "#F8FAFC", dot: "#CBD5E1", line: TEAL, off: "#94A3B8", on: "#22C55E", offFill: "#94A3B8", label: "#334155", text: "#FFFFFF", group: "#FFFFFF", groupLine: "#CBD5E1", ant: "#CBD5E1" };

  function toggleTheme() {
    const next: Theme = dark ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* stockage indisponible */ }
  }

  async function toggleFull() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await box.current?.requestFullscreen();
    } catch {
      /* plein écran refusé */
    }
  }

  function exportPng() {
    const el = svg.current;
    if (!el) return;
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = W * 2;
      cv.height = H * 2;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      const a = document.createElement("a");
      a.href = cv.toDataURL("image/png");
      a.download = "topologie-vpn.png";
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(el));
  }

  function pointer(e: React.PointerEvent<SVGElement>): Pos {
    const el = svg.current!;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(el.getScreenCTM()!.inverse());
    return { x: p.x, y: p.y };
  }

  function endDrag() {
    if (!dragging.current) return;
    dragging.current = null;
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(plan)); } catch { /* stockage indisponible */ }
  }

  function refresh() {
    setAgo(0);
    onRefresh?.();
  }

  const total = nodes.length;
  const online = nodes.filter((r) => r.state === "online").length;
  const configured = nodes.filter((r) => r.state === "configured").length;
  const critical = nodes.filter((r) => r.state === "suspended" || r.score < 55).length;
  const watch = nodes.filter((r) => r.state !== "suspended" && r.score >= 55 && r.score < 75).length;
  const scored = nodes.filter((r) => r.state !== "suspended");
  const health = scored.length ? Math.round(scored.reduce((s, r) => s + r.score, 0) / scored.length) : 0;
  const antennas = nodes.reduce((n, r) => n + r.antennas.length, 0);
  const vb = { w: W / zoom, h: H / zoom };
  const ibtn = "flex h-8 w-9 items-center justify-center rounded-[3px] border border-slate-300 bg-white text-slate-500 hover:bg-slate-50";
  const agoText = ago < 60 ? `il y a ${ago} s` : `il y a ${Math.floor(ago / 60)} min`;

  return (
    <div className="grid gap-0 overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] lg:grid-cols-[1fr_310px]">
      <div ref={box} className={`relative ${full ? "bg-white p-3" : ""}`}>
        <div className="relative overflow-hidden" style={{ background: c.bg }}>
          <svg
            ref={svg}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`${CX - vb.w / 2} ${CY - vb.h / 2} ${vb.w} ${vb.h}`}
            className={`h-auto w-full touch-none ${full ? "max-h-[85vh]" : ""}`}
            style={{ minHeight: 320 }}
            onPointerMove={(e) => {
              if (!dragging.current) return;
              const p = pointer(e);
              const id = dragging.current.id;
              const d = dragging.current;
              setPlan((pl) => ({ ...pl, [id]: { x: p.x - d.dx, y: p.y - d.dy } }));
            }}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <defs>
              <pattern id="topoGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.9" fill={c.dot} />
              </pattern>
              <radialGradient id="topoGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={TEAL} stopOpacity="0.4" />
                <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="-400" y="-400" width={W + 800} height={H + 800} fill="url(#topoGrid)" />

            {extra?.map((g) => (
              <g key={g.label}>
                <rect x={g.x} y={g.y} width={g.w} height={g.h} rx="12" fill={c.group} stroke={c.groupLine} />
                <text x={g.x + 12} y={g.y + 20} fill={c.label} fontSize="11" fontWeight="bold">{g.label}</text>
              </g>
            ))}

            {nodes.map((r, i) => {
              const p = at(i);
              const on = r.state === "online";
              return (
                <g key={`l-${r.id}`}>
                  <line x1={hub.x} y1={hub.y} x2={p.x} y2={p.y} stroke={on ? c.line : c.off} strokeWidth="1.6" strokeDasharray="5 4" opacity={on ? 0.9 : 0.6} />
                  {r.antennas.map((a, k) => {
                    const ap = antennaPos(p, k, r.antennas.length);
                    return (
                      <g key={a}>
                        <line x1={p.x} y1={p.y} x2={ap.x} y2={ap.y} stroke={c.line} strokeWidth="1" opacity="0.7" />
                        <rect x={ap.x - 5} y={ap.y - 5} width="10" height="10" rx="2" fill={c.ant} stroke={c.off} />
                        {labels && <text x={ap.x} y={ap.y + 17} textAnchor="middle" fill={c.label} fontSize="7">{a}</text>}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            <circle cx={hub.x} cy={hub.y} r="64" fill="url(#topoGlow)" />
            <circle cx={hub.x} cy={hub.y} r="26" fill={TEAL} stroke="#BFEFF6" strokeWidth="3" />
            <text x={hub.x} y={hub.y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">VPN</text>

            {nodes.map((r, i) => {
              const p = at(i);
              const on = r.state === "online";
              return (
                <g
                  key={r.id}
                  style={{ cursor: view === "free" ? "grab" : "default" }}
                  onPointerDown={(e) => {
                    if (view !== "free") return;
                    svg.current?.setPointerCapture?.(e.pointerId);
                    const pt = pointer(e);
                    dragging.current = { id: r.id, dx: pt.x - p.x, dy: pt.y - p.y };
                  }}
                >
                  <circle cx={p.x} cy={p.y} r="13" fill={on ? c.on : c.offFill} stroke="white" strokeWidth="2" />
                  <circle cx={p.x} cy={p.y} r="4.5" fill="white" opacity="0.9" />
                  {r.score > 0 && (
                    <g>
                      <circle cx={p.x - 11} cy={p.y - 11} r="8" fill={r.score >= 75 ? "#0EA5E9" : r.score >= 55 ? "#F59E0B" : "#EF4444"} stroke="white" strokeWidth="1.5" />
                      <text x={p.x - 11} y={p.y - 8.5} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">{r.score}</text>
                    </g>
                  )}
                  {labels && <text x={p.x} y={p.y + 27} textAnchor="middle" fill={c.label} fontSize="9" fontWeight="600">{r.name.length > 20 ? r.name.slice(0, 18) + "…" : r.name}</text>}
                </g>
              );
            })}

            {nodes.length === 0 && (
              <text x={CX} y={CY + 70} textAnchor="middle" fill={c.label} fontSize="11">Aucun routeur : ajoutez-en un pour voir la topologie.</text>
            )}
            <text x="14" y={H - 12} fill={c.label} opacity="0.55" fontSize="8">
              Glissez chaque équipement à sa place · Alt : sans aimantation · le plan est mémorisé
            </text>
          </svg>

          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
            <button onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))} className={ibtn} aria-label="Zoom avant"><Plus className="h-4 w-4" /></button>
            <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} className={ibtn} aria-label="Zoom arrière"><Minus className="h-4 w-4" /></button>
            <button onClick={() => { setZoom(1); setPlan({}); try { localStorage.removeItem(PLAN_KEY); } catch { /* indisponible */ } }} className={ibtn} aria-label="Recentrer"><Scan className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 text-center">
          {[
            { icon: Network, l: "Concentrateur VPN", v: "Actif" },
            { icon: Link2, l: "Tunnels ouverts", v: `${online} / ${total}` },
            { icon: Radio, l: "Antennes desservies", v: String(antennas) },
          ].map((s) => (
            <div key={s.l} className="px-2 py-3">
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500"><s.icon className="h-3.5 w-3.5" /> {s.l}</p>
              <p className="mt-0.5 truncate text-[13px] font-bold text-slate-800">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau de droite */}
      <aside className="space-y-3 border-t border-slate-200 p-4 lg:border-l lg:border-t-0">
        <h3 className="flex items-center gap-2 text-[18px] font-medium text-slate-800"><Network className="h-5 w-5" /> Topologie</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Network, v: total, l: "routeurs", c: TEAL },
            { icon: Link2, v: online, l: "tunnels actifs", c: "#10B981" },
            { icon: Radio, v: antennas, l: "antennes", c: "#0EA5E9" },
            { icon: Monitor, v: workstations, l: "postes", c: "#8B5CF6" },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[13px] text-slate-600">
              <s.icon className="h-4 w-4 shrink-0" style={{ color: s.c }} />
              <b className="text-slate-900">{s.v}</b> {s.l}
            </div>
          ))}
        </div>

        <div className="relative">
          <button onClick={() => setLegend((l) => !l)} className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            <CircleDot className="h-4 w-4" /> Légende
          </button>
          {legend && (
            <div className="absolute left-0 right-0 top-10 z-20 space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 text-[12px] text-slate-600 shadow-lg">
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" /> Routeur en ligne</p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-400" /> Configuré / indéterminé</p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-slate-400 bg-slate-200" /> Antenne</p>
              <p className="flex items-center gap-2"><span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sky-500 text-[7px] font-bold text-white">80</span> Score de santé (0-100)</p>
            </div>
          )}
        </div>

        <select
          value={view}
          onChange={(e) => setView(e.target.value as View)}
          className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-[14px] text-slate-700"
        >
          {["Schémas dynamiques", "Schémas structurés", "Plan personnalisé"].map((g) => (
            <optgroup key={g} label={g}>
              {VIEWS.filter((v) => v.group === g).map((v) => (
                <option key={v.key} value={v.key}>{v.label}</option>
              ))}
            </optgroup>
          ))}
        </select>

        <div className="grid grid-cols-7 gap-1.5">
          <button className={ibtn} onClick={() => setLabels((l) => !l)} aria-label="Afficher les noms" title="Afficher / masquer les noms"><List className="h-4 w-4" /></button>
          <button className={ibtn} onClick={toggleFull} aria-label="Plein écran" title="Plein écran">{full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
          <button className={ibtn} onClick={() => { setView("force"); setPlan({}); }} aria-label="Réorganiser" title="Réorganiser automatiquement"><Wand2 className="h-4 w-4" /></button>
          <button className={ibtn} onClick={exportPng} aria-label="Exporter en image" title="Exporter en image"><Camera className="h-4 w-4" /></button>
          <button className={ibtn} onClick={toggleTheme} aria-label={dark ? "Mode clair" : "Mode sombre"} title={dark ? "Mode clair" : "Mode sombre"}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          <button className={ibtn} onClick={() => setView("groups")} aria-label="Vue par groupes" title="Vue par groupes"><Monitor className="h-4 w-4" /></button>
          <button className={ibtn} onClick={refresh} aria-label="Actualiser" title="Actualiser"><RefreshCw className="h-4 w-4" /></button>
        </div>
        <p className="text-right text-[11px] text-slate-400">{agoText}</p>

        <div className="grid grid-cols-2 gap-2 text-[13px] font-semibold">
          <span className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-slate-700"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{online} en ligne</span>
          <span className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-700"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" />{configured} indéterminées</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-white" style={{ background: TEAL }}>
          <Wifi className="h-4 w-4" /> {critical === 0 ? "Parc stable ce mois-ci" : "Parc à surveiller ce mois-ci"}
        </div>
        <div className="flex gap-2 text-[13px] font-semibold">
          <span className="flex flex-1 items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-slate-700">
            <Trophy className="h-4 w-4 text-amber-600" /> {total} / 25
            <span className="h-1.5 flex-1 rounded-full bg-amber-200"><span className="block h-full rounded-full bg-amber-500" style={{ width: `${Math.min(100, (total / 25) * 100)}%` }} /></span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-slate-700"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />{critical} critique(s)</span>
        </div>
        <p className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[13px] font-semibold text-slate-700"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />{watch} à surveiller</p>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-[13px] font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-teal-500 text-[9px] text-teal-600">{health}</span>
            Santé du parc {health}/100
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${health}%` }} /></div>
        </div>
        {routers.length > MAX && <p className="text-xs text-slate-500">{MAX} routeurs affichés sur {routers.length}.</p>}
      </aside>
    </div>
  );
}
