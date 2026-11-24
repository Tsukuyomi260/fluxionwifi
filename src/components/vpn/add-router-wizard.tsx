"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Info,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  Router,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import type { VpnProtocol } from "@/lib/supabase/types";

type RouterOsVersion = "v7" | "v6";

interface ProtocolOption {
  key: string;
  label: string;
  badge?: { text: string; cls: string };
  desc: string;
  version: string;
  supported: boolean;
  icon: typeof Lock;
}

const PROTOCOLS: ProtocolOption[] = [
  { key: "SSTP", label: "SSTP", badge: { text: "Recommandé", cls: "bg-amber-500 text-white" }, desc: "TLS : passe NAT et pare-feu", version: "v6 et v7", supported: true, icon: Lock },
  { key: "WireGuard", label: "WireGuard", badge: { text: "Performant", cls: "bg-emerald-500 text-white" }, desc: "Rapide et léger", version: "RouterOS v7 uniquement", supported: true, icon: Zap },
  { key: "L2TP", label: "L2TP/IPsec", desc: "Compatible, plus complexe", version: "v6 et v7", supported: false, icon: Shield },
  { key: "OpenVPN", label: "OpenVPN", desc: "Souple, plus lent", version: "v6 et v7", supported: false, icon: Shield },
  { key: "PPTP", label: "PPTP", badge: { text: "Hérité", cls: "bg-slate-500 text-white" }, desc: "Peu sécurisé : déconseillé", version: "v6 et v7", supported: false, icon: Shield },
];

const STEPS = ["Protocole", "Identité", "Connexion", "Validation"];

const input =
  "h-11 w-full rounded-[3px] border border-slate-300 bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-500 focus:border-[#17A2B8] focus:outline-none focus:ring-2 focus:ring-[#17A2B8]/30";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const hint = "mt-1 text-xs text-slate-500";

function randomString(len: number, alphabet: string) {
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

function slug(name: string) {
  return (
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "routeur"
  );
}

/** Convertit les commandes « espaces » en syntaxe RouterOS v7 « /slashes ». */
function toSyntax(lines: string[], version: RouterOsVersion): string {
  if (version === "v6") return lines.join("\n");
  return lines
    .map((l) => l.replace(/^(\/[a-z0-9-]+(?: [a-z0-9-]+)*?) (add|set|enable|remove)\b/, (_m, path: string, verb: string) => `${path.replace(/ /g, "/")} ${verb}`))
    .join("\n");
}

export interface WizardResult {
  name: string;
  protocol: VpnProtocol;
  serverHost: string;
  port: number;
  note: string;
}

export function AddRouterWizard({
  serverHost,
  onCreate,
  onDone,
}: {
  serverHost: string;
  onCreate: (r: WizardResult) => Promise<void>;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const [protocol, setProtocol] = useState<VpnProtocol>("SSTP");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [version, setVersion] = useState<RouterOsVersion>("v7");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [tunnelIp, setTunnelIp] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const port = protocol === "WireGuard" ? 51820 : 443;
  const wgBlocked = protocol === "WireGuard" && version === "v6";

  function goConnexion() {
    // Identifiants créés uniquement ici (événement), jamais pendant le rendu.
    if (!user) setUser(`${slug(name)}-${randomString(4, "abcdefghjkmnpqrstuvwxyz23456789")}`);
    if (!pass) setPass(randomString(10, "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"));
    if (!tunnelIp) setTunnelIp(`100.64.${1 + Math.floor(Math.random() * 200)}.${2 + Math.floor(Math.random() * 250)}`);
    setStep(2);
  }

  const script =
    protocol === "SSTP"
      ? toSyntax(
          [
            `/interface sstp-client add name=fluxion-vpn connect-to=${serverHost}:${port} user=${user} password=${pass} profile=default-encryption verify-server-certificate=no disabled=no`,
            `/ip route add dst-address=100.64.0.0/16 gateway=fluxion-vpn comment="FLUXION VPN"`,
          ],
          version
        )
      : toSyntax(
          [
            `/interface wireguard add name=fluxion-wg listen-port=13231`,
            `/interface wireguard peers add interface=fluxion-wg public-key="<CLE_PUBLIQUE_DU_SERVEUR>" endpoint-address=${serverHost} endpoint-port=${port} allowed-address=100.65.0.0/16 persistent-keepalive=25s`,
            `/ip address add address=${tunnelIp}/16 interface=fluxion-wg`,
          ],
          "v7"
        );

  async function copy() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  async function finish() {
    setSaving(true);
    setError(null);
    try {
      await onCreate({ name: name.trim(), protocol, serverHost, port, note: note.trim() });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible d'enregistrer le routeur.");
    } finally {
      setSaving(false);
    }
  }

  const ProtoIcon = protocol === "WireGuard" ? Zap : Lock;

  return (
    <div className="space-y-5">
      

      <div className="mx-auto max-w-2xl overflow-hidden rounded-[3px] border-t-[3px] border-t-[#17A2B8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800">
          <span className="flex items-center gap-2"><Router className="h-4 w-4 text-[#17A2B8]" /> Nouveau routeur</span>
          <span className="text-xs font-normal text-slate-500">À propos : aide rapide</span>
        </div>

        {/* Schéma Routeur - protocole - Serveur */}
        <div className="px-5 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1 text-[11px] text-slate-500"><Router className="h-6 w-6 text-slate-600" /> Routeur</div>
            <div className="relative h-px flex-1 border-t border-dashed border-slate-400">
              <span className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#17A2B8] bg-slate-50">
                <ProtoIcon className="h-3.5 w-3.5 text-[#17A2B8]" />
              </span>
              <span className="absolute left-1/2 top-4 -translate-x-1/2 text-[10px] font-semibold text-[#17A2B8]">{protocol}</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[11px] text-slate-500"><Server className="h-6 w-6 text-slate-600" /> Serveur VPN</div>
          </div>

          {/* Étapes */}
          <ol className="mt-6 flex items-start">
            {STEPS.map((s, i) => {
              const done = i < step || saved;
              const current = i === step && !saved;
              return (
                <li key={s} className="relative flex flex-1 flex-col items-center">
                  {i > 0 && <span className={`absolute right-1/2 top-4 h-0.5 w-full ${i <= step || saved ? "bg-emerald-500" : "bg-slate-200"}`} />}
                  <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    done ? "border-emerald-500 bg-emerald-500 text-white" : current ? "border-[#17A2B8] bg-[#17A2B8] text-white" : "border-slate-300 bg-slate-50 text-slate-500"
                  }`}>
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={`mt-1.5 text-[11px] ${current ? "font-semibold text-slate-800" : "text-slate-500"}`}>{s}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="p-5">
          {/* ÉTAPE 1 */}
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#17A2B8]">Étape 1 : choisissez le protocole</p>
              <p className="text-xs text-slate-500">Choisissez selon la version de votre routeur et la compatibilité réseau.</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PROTOCOLS.map((p) => {
                  const selected = p.supported && protocol === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      disabled={!p.supported}
                      onClick={() => setProtocol(p.key as VpnProtocol)}
                      className={`relative rounded-xl border-2 p-3.5 text-left transition-colors ${
                        selected ? "border-[#17A2B8] bg-[#17A2B8]/15" : p.supported ? "border-slate-200 hover:border-slate-400" : "cursor-not-allowed border-slate-200 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <p.icon className={`h-4 w-4 ${selected ? "text-[#17A2B8]" : "text-slate-500"}`} />
                        <span className="text-sm font-semibold text-slate-800">{p.label}</span>
                        {p.badge && p.supported && <span className={`ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${p.badge.cls}`}>{p.badge.text}</span>}
                        {!p.supported && <span className="ml-auto rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-600">Bientôt</span>}
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">{p.desc}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{p.version}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#17A2B8]">Étape 2 : identifiez le routeur</p>
              <div>
                <label className={label} htmlFor="w-name">Nom du routeur <span className="text-red-400">*</span></label>
                <input id="w-name" className={input} placeholder="ex. Boutique-Centre" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              </div>
              <div>
                <label className={label} htmlFor="w-note">Note / emplacement</label>
                <input id="w-note" className={input} placeholder="Quartier, contact, modèle…" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="w-ver">Version RouterOS du routeur <span className="font-normal text-slate-500">: syntaxe des commandes</span></label>
                <select id="w-ver" className={input} value={version} onChange={(e) => setVersion(e.target.value as RouterOsVersion)}>
                  <option value="v7">RouterOS v7 (syntaxe avec slashes)</option>
                  <option value="v6">RouterOS v6 (syntaxe avec espaces)</option>
                </select>
                <p className={hint}>Le script généré s&apos;adapte à la version choisie (/interface/… ou /interface …).</p>
              </div>
              {wgBlocked && (
                <p className="flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-300"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> WireGuard nécessite RouterOS v7. Choisissez v7 ou revenez à l&apos;étape 1 pour prendre SSTP.</p>
              )}
            </div>
          )}

          {/* ÉTAPE 3 */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#17A2B8]">Étape 3 : paramètres de connexion</p>
              {protocol === "SSTP" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label} htmlFor="w-user">Nom d&apos;utilisateur <span className="font-normal text-slate-500">(compte VPN)</span></label>
                    <input id="w-user" className={input} value={user} onChange={(e) => setUser(e.target.value)} />
                  </div>
                  <div>
                    <label className={label} htmlFor="w-pass">Mot de passe</label>
                    <div className="flex gap-2">
                      <input id="w-pass" className={`${input} font-mono`} value={pass} onChange={(e) => setPass(e.target.value)} />
                      <button type="button" aria-label="Générer un mot de passe" onClick={() => setPass(randomString(10, "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"))} className="shrink-0 rounded-lg border border-slate-200 px-3 text-slate-600 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600"><KeyRound className="mr-1.5 inline h-3.5 w-3.5 text-[#17A2B8]" /> WireGuard : le routeur crée sa propre paire de clés. La clé publique du serveur sera fournie par la plateforme.</p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Hôte serveur <span className="font-normal text-slate-500">(connect-to)</span></label>
                  <input className={`${input} text-slate-500`} value={serverHost} readOnly />
                </div>
                <div>
                  <label className={label}>Port serveur</label>
                  <input className={`${input} text-slate-500`} value={String(port)} readOnly />
                </div>
              </div>
              <p className="flex items-start gap-2 rounded-lg bg-[#17A2B8]/10 px-3 py-2 text-xs text-[#0B6070]"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Le serveur attribue l&apos;IP de tunnel à ce compte (champ « IP de tunnel attribuée »).</p>
              <div>
                <label className={label}>IP de tunnel attribuée</label>
                <input className={`${input} font-mono text-slate-500`} value={tunnelIp} readOnly />
                <p className={hint}>Attribuée automatiquement, non modifiable.</p>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#17A2B8]">Étape 4 : validation et script</p>
              {!saved ? (
                <>
                  <dl className="grid gap-x-6 gap-y-2 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
                    {([["Routeur", name], ["Protocole", `${protocol} · RouterOS ${version}`], ["Serveur", `${serverHost}:${port}`], ["IP de tunnel", tunnelIp]] as [string, string][]).map(([k, v]) => (
                      <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd className="font-medium text-slate-800">{v}</dd></div>
                    ))}
                  </dl>
                  <p className="text-xs text-slate-500">Validez pour créer le routeur, puis collez le script dans <b>New Terminal</b> du routeur.</p>
                  {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Routeur « {name} » enregistré. Il apparaîtra automatiquement dans « Routeurs VPN » dès qu&apos;il se connecte (environ 10 secondes).
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-200">Script à coller dans New Terminal :</p>
                      <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg bg-[#17A2B8] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#138496]">
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copié" : "Copier"}
                      </button>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[#0F172A] p-3 font-mono text-xs leading-relaxed text-emerald-300">{script}</pre>
                    {protocol === "WireGuard" && (
                      <p className="mt-2 text-xs text-amber-300">La clé publique du serveur (« &lt;CLE_PUBLIQUE_DU_SERVEUR&gt; ») sera renseignée par le back-end.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
            {step > 0 && !saved ? (
              <button onClick={() => setStep(step - 1)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm text-slate-600 hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> Retour</button>
            ) : <span />}

            {step === 0 && (
              <button onClick={() => setStep(1)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#17A2B8] px-5 text-sm font-medium text-white hover:bg-[#138496]">Continuer <ArrowRight className="h-4 w-4" /></button>
            )}
            {step === 1 && (
              <button onClick={goConnexion} disabled={!name.trim() || wgBlocked} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#17A2B8] px-5 text-sm font-medium text-white hover:bg-[#138496] disabled:cursor-not-allowed disabled:opacity-50">Continuer <ArrowRight className="h-4 w-4" /></button>
            )}
            {step === 2 && (
              <button onClick={() => setStep(3)} disabled={protocol === "SSTP" && (!user.trim() || !pass.trim())} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#17A2B8] px-5 text-sm font-medium text-white hover:bg-[#138496] disabled:cursor-not-allowed disabled:opacity-50">Continuer <ArrowRight className="h-4 w-4" /></button>
            )}
            {step === 3 && !saved && (
              <button onClick={finish} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Valider
              </button>
            )}
            {step === 3 && saved && (
              <button onClick={onDone} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#17A2B8] px-5 text-sm font-medium text-white hover:bg-[#138496]">Voir mes routeurs <ArrowRight className="h-4 w-4" /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
