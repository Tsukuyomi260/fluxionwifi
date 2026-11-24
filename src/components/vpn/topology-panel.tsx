"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, ChevronDown, Maximize2, Minimize2, Minus, Moon, Plus, Sun, Scan } from "lucide-react";

interface TopoRouter {
  id: string;
  name: string;
  status: string;
}

type View = "force" | "radial" | "orbital" | "tree" | "groups" | "free";
type Theme = "dark" | "light";

const VIEWS: { key: View; label: string; group: string }[] = [
  { key: "force", label: "Vue force-directed", group: "Schémas dynamiques" },
  { key: "radial", label: "Vue radiale", group: "Schémas dynamiques" },
  { key: "orbital", label: "Vue orbitale", group: "Schémas dynamiques" },
  { key: "tree", label: "Vue arborescente", group: "Schémas structurés" },
  { key: "groups", label: "Vue par groupes", group: "Schémas structurés" },
  { key: "free", label: "Vue libre — mon plan", group: "Plan personnalisé" },
];

const W = 600;
const H = 400;
const CX = W / 2;
const CY = H / 2;
const MAX = 24;

type Pos = { x: number; y: number };

function ring(n: number, r: number, offset = 0): Pos[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2 + offset;
    return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r * 0.82 };
  });
}

// Simulation de forces déterministe : répulsion entre nœuds, ressort vers le centre.
function forceLayout(n: number): Pos[] {
  let seed = 11;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const pts = ring(n, 120).map((p) => ({ x: p.x + (rnd() - 0.5) * 60, y: p.y + (rnd() - 0.5) * 60 }));
  for (let it = 0; it < 120; it++) {
    for (let i = 0; i < n; i++) {
      let fx = (CX - pts[i].x) * 0.01;
      let fy = (CY - pts[i].y) * 0.012;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d2 = dx * dx + dy * dy + 1;
        fx += (dx / d2) * 900;
        fy += (dy / d2) * 900;
      }
      const dc = Math.hypot(pts[i].x - CX, pts[i].y - CY) || 1;
      if (dc < 90) { fx += ((pts[i].x - CX) / dc) * 3; fy += ((pts[i].y - CY) / dc) * 3; }
      pts[i].x = Math.min(W - 40, Math.max(40, pts[i].x + fx));
      pts[i].y = Math.min(H - 40, Math.max(40, pts[i].y + fy));
    }
  }
  return pts;
}

function layout(view: View, routers: TopoRouter[]): { pos: Pos[]; hub: Pos; extra?: { label: string; x: number; y: number; w: number; h: number }[] } {
  const n = routers.length;
  const hub = { x: CX, y: CY };
  if (view === "force") return { pos: forceLayout(n), hub };
  if (view === "radial" || view === "free") return { pos: ring(n, 150), hub };
  if (view === "orbital") {
    const inner = routers.map((r, i) => ({ r, i })).filter((o) => o.r.status === "online");
    const outer = routers.map((r, i) => ({ r, i })).filter((o) => o.r.status !== "online");
    const pos: Pos[] = new Array(n);
    ring(inner.length, 95).forEach((p, k) => (pos[inner[k].i] = p));
    ring(outer.length, 160, 0.4).forEach((p, k) => (pos[outer[k].i] = p));
    return { pos, hub };
  }
  if (view === "tree") {
    const perRow = 6;
    const rows = Math.ceil(n / perRow) || 1;
    const pos = routers.map((_, i) => {
      const row = Math.floor(i / perRow);
      const inRow = Math.min(perRow, n - row * perRow);
      const col = i % perRow;
      return { x: (W / (inRow + 1)) * (col + 1), y: 130 + (row * 220) / Math.max(rows, 1) + (rows > 1 ? 0 : 60) };
    });
    return { pos, hub: { x: CX, y: 50 } };
  }
  // groups : un bloc par état
  const groups = [
    { label: "En ligne", test: (r: TopoRouter) => r.status === "online" },
    { label: "Hors ligne", test: (r: TopoRouter) => r.status === "offline" },
    { label: "À surveiller", test: (r: TopoRouter) => r.status !== "online" && r.status !== "offline" },
  ].filter((g) => routers.some(g.test));
  const pos: Pos[] = new Array(n);
  const extra: { label: string; x: number; y: number; w: number; h: number }[] = [];
  const gw = W / Math.max(groups.length, 1);
  groups.forEach((g, gi) => {
    const items = routers.map((r, i) => ({ r, i })).filter((o) => g.test(o.r));
    extra.push({ label: g.label, x: gi * gw + 14, y: 110, w: gw - 28, h: 260 });
    items.forEach((o, k) => {
      const cols = 2;
      pos[o.i] = { x: gi * gw + gw / 2 + (k % cols === 0 ? -34 : 34), y: 160 + Math.floor(k / cols) * 52 };
    });
  });
  return { pos, hub: { x: CX, y: 50 }, extra };
}

export function TopologyPanel({ routers }: { routers: TopoRouter[] }) {
  const nodes = useMemo(() => routers.slice(0, MAX), [routers]);
  const [view, setView] = useState<View>("radial");
  const [theme, setTheme] = useState<Theme>("dark");
  const [zoom, setZoom] = useState(1);
  const [menu, setMenu] = useState(false);
  const [full, setFull] = useState(false);
  const [drag, setDrag] = useState<Record<string, Pos>>({});
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef<{ id: string; dx: number; dy: number } | null>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem("fluxion-topology-theme");
      if (t === "light" || t === "dark") setTheme(t);
    } catch {
      /* stockage indisponible */
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("fluxion-topology-theme", next); } catch { /* stockage indisponible */ }
  }

  async function toggleFull() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await box.current?.requestFullscreen();
    } catch {
      /* plein écran refusé */
    }
  }

  const { pos, hub, extra } = useMemo(() => layout(view, nodes), [view, nodes]);
  const at = (i: number): Pos => (view === "free" && drag[nodes[i].id]) || pos[i];

  function exportPng() {
    const el = svg.current;
    if (!el) return;
    const xml = new XMLSerializer().serializeToString(el);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = W * 2;
      c.height = H * 2;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = dark ? "#0B1220" : "#F1F5F9";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "topologie-vpn.png";
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
  }

  function pointer(e: React.PointerEvent<SVGSVGElement>): Pos {
    const el = svg.current!;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(el.getScreenCTM()!.inverse());
    return { x: p.x, y: p.y };
  }

  const dark = theme === "dark";
  const c = dark
    ? { bg: "#0B1220", line: "#0E7490", off: "#475569", nodeOn: "#065F46", nodeOff: "#1E293B", label: "#94A3B8", text: "#FFFFFF", group: "#111A2E", groupLine: "#1E2A44" }
    : { bg: "#F1F5F9", line: "#0E7490", off: "#94A3B8", nodeOn: "#D1FAE5", nodeOff: "#E2E8F0", label: "#475569", text: "#0F172A", group: "#FFFFFF", groupLine: "#CBD5E1" };

  const btn = "flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10";
  const current = VIEWS.find((v) => v.key === view)!;
  const vb = { w: W / zoom, h: H / zoom };

  return (
    <div ref={box} className={`relative ${full ? "bg-[#0F172A] p-4" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4">
        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} className="flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-slate-200 hover:bg-white/10">
            {current.label} <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {menu && (
            <div className="absolute left-0 top-9 z-20 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#0F172A] py-1 shadow-2xl">
              {["Schémas dynamiques", "Schémas structurés", "Plan personnalisé"].map((g) => (
                <div key={g}>
                  <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">{g}</p>
                  {VIEWS.filter((v) => v.group === g).map((v) => (
                    <button key={v.key} onClick={() => { setView(v.key); setMenu(false); }} className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-slate-200 hover:bg-white/5">
                      {v.label} {v.key === view && <Check className="h-3.5 w-3.5 text-[#22D3EE]" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={toggleTheme} className={btn} aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"} title={dark ? "Mode clair" : "Mode sombre"}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={exportPng} className={btn} aria-label="Exporter en image" title="Exporter en image"><Camera className="h-4 w-4" /></button>
          <button onClick={toggleFull} className={btn} aria-label="Plein écran" title="Plein écran">{full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
        </div>
      </div>

      <div className="relative p-5">
        <div className="overflow-hidden rounded-xl" style={{ background: c.bg }}>
          <svg
            ref={svg}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`${CX - vb.w / 2} ${CY - vb.h / 2} ${vb.w} ${vb.h}`}
            className={`h-auto w-full touch-none ${full ? "max-h-[80vh]" : ""}`}
            style={{ minHeight: 280 }}
            onPointerMove={(e) => {
              if (!dragging.current) return;
              const p = pointer(e);
              const id = dragging.current.id;
              setDrag((d) => ({ ...d, [id]: { x: p.x - dragging.current!.dx, y: p.y - dragging.current!.dy } }));
            }}
            onPointerUp={() => (dragging.current = null)}
            onPointerLeave={() => (dragging.current = null)}
          >
            <defs>
              <radialGradient id="topoGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0E7490" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0E7490" stopOpacity="0" />
              </radialGradient>
            </defs>

            {extra?.map((g) => (
              <g key={g.label}>
                <rect x={g.x} y={g.y} width={g.w} height={g.h} rx="12" fill={c.group} stroke={c.groupLine} />
                <text x={g.x + 12} y={g.y + 20} fill={c.label} fontSize="10" fontWeight="bold">{g.label}</text>
              </g>
            ))}

            {nodes.map((r, i) => {
              const p = at(i);
              const on = r.status === "online";
              return <line key={`l-${r.id}`} x1={hub.x} y1={hub.y} x2={p.x} y2={p.y} stroke={on ? c.line : c.off} strokeWidth="1.5" strokeDasharray={on ? "none" : "4 4"} opacity={on ? 0.65 : 0.4} />;
            })}

            <circle cx={hub.x} cy={hub.y} r="62" fill="url(#topoGlow)" />
            <circle cx={hub.x} cy={hub.y} r="28" fill="#0E7490" stroke="#06B6D4" strokeWidth="2" />
            <text x={hub.x} y={hub.y - 3} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VPN</text>
            <text x={hub.x} y={hub.y + 10} textAnchor="middle" fill="#A5F3FC" fontSize="7">HUB</text>

            {nodes.map((r, i) => {
              const p = at(i);
              const on = r.status === "online";
              return (
                <g
                  key={r.id}
                  style={{ cursor: view === "free" ? "grab" : "default" }}
                  onPointerDown={(e) => {
                    if (view !== "free") return;
                    (e.currentTarget.ownerSVGElement as SVGSVGElement).setPointerCapture?.(e.pointerId);
                    const pt = pointer(e as unknown as React.PointerEvent<SVGSVGElement>);
                    dragging.current = { id: r.id, dx: pt.x - p.x, dy: pt.y - p.y };
                  }}
                >
                  <circle cx={p.x} cy={p.y} r="17" fill={on ? c.nodeOn : c.nodeOff} stroke={on ? "#10B981" : c.off} strokeWidth="2" />
                  <text x={p.x} y={p.y + 3} textAnchor="middle" fill={c.text} fontSize="7" fontWeight="bold">R{i + 1}</text>
                  <circle cx={p.x + 12} cy={p.y - 12} r="4" fill={on ? "#10B981" : "#EF4444"} />
                  <text x={p.x} y={p.y + 30} textAnchor="middle" fill={c.label} fontSize="7">{r.name.length > 18 ? r.name.slice(0, 16) + "…" : r.name}</text>
                </g>
              );
            })}

            {nodes.length === 0 && (
              <text x={CX} y={CY + 60} textAnchor="middle" fill={c.label} fontSize="10">Aucun routeur : ajoutez-en un pour voir la topologie.</text>
            )}
          </svg>
        </div>

        <div className="absolute bottom-8 right-8 flex flex-col gap-1.5">
          <button onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))} className={btn} aria-label="Zoom avant"><Plus className="h-4 w-4" /></button>
          <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} className={btn} aria-label="Zoom arrière"><Minus className="h-4 w-4" /></button>
          <button onClick={() => { setZoom(1); setDrag({}); }} className={btn} aria-label="Recentrer"><Scan className="h-4 w-4" /></button>
        </div>
      </div>
      {routers.length > MAX && <p className="px-5 pb-4 text-xs text-slate-500">{MAX} routeurs affichés sur {routers.length}.</p>}
    </div>
  );
}
