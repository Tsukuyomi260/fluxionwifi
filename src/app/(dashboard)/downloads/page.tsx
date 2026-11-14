"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Wifi,
  Code,
  CreditCard,
  FileCode,
  Terminal,
  Shield,
  ExternalLink,
  Check,
  X,
  FileText,
  Monitor,
} from "lucide-react";

export default function DownloadsPage() {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  const handleDownload = (name: string, filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadedItem(name);
    setTimeout(() => setDownloadedItem(null), 3000);
  };

  const sampleRscScript = `# ==========================================
# FLUXIONWIFI - SCRIPT MIKROTIK ROUTEROS
# ==========================================
/ip hotspot profile
set [ find default=yes ] html-directory=hotspot login-by=http-chap,http-pap use-radius=yes
/radius
add address=187.124.34.197 secret="fluxion-secret" service=hotspot authentication-port=1812 accounting-port=1813
/ip hotspot user profile
set [ find default=yes ] transparent-proxy=no
/system script
add dont-require-permissions=no name=fluxion-sync owner=admin source="/tool fetch url=\\"https://app.fluxionwifi.com/api/sync\\" keep-result=no"
`;

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#0B132B]/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 text-white">
      {/* Modal Card matching 07-telechargements.jpg */}
      <div className="w-full max-w-2xl bg-[#131B2E] border border-[#1F293D] rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F293D]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Download className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-black text-amber-400 tracking-wide">
              Téléchargements
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="h-8 w-8 rounded-full bg-[#1E293B] hover:bg-[#334155] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        {downloadedItem && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Fichier « {downloadedItem} » téléchargé avec succès !</span>
          </div>
        )}

        {/* Section 1: Portails Captifs */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <Wifi className="h-4 w-4" />
            <span>Portails Captifs</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#162035] border border-[#1E293D] space-y-3">
            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all"
            >
              <FileCode className="h-4 w-4" />
              <span>Choisir et Télécharger un Portail</span>
            </Link>
            <p className="text-[11px] text-gray-400">
              4 designs disponibles avec prévisualisation en direct et intégration MikroTik RouterOS v6/v7.
            </p>
          </div>
        </section>

        {/* Section 2: Portails Captifs Personnalisés */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <span>Portails Captifs Personnalisés</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2B7FFF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-[#2B7FFF]/20"
            >
              <Code className="h-3.5 w-3.5" />
              <span>&lt;/&gt; Intégrer sur un portail</span>
            </Link>

            <Link
              href="/portal"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2B7FFF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-[#2B7FFF]/20"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Générer une page de paiement</span>
            </Link>
          </div>
        </section>

        {/* Section 3: Scripts RouterOS MikroTik */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <Terminal className="h-4 w-4" />
            <span>Scripts d&apos;installation RouterOS (.rsc)</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#162035] border border-[#1E293D] hover:border-[#2B7FFF]/30 transition-all">
              <div>
                <p className="text-xs font-bold text-white">fluxion-hotspot-setup.rsc</p>
                <p className="text-[11px] text-gray-400">Configuration automatique FreeRADIUS + Hotspot MikroTik</p>
              </div>
              <button
                onClick={() =>
                  handleDownload(
                    "fluxion-hotspot-setup.rsc",
                    "fluxion-hotspot-setup.rsc",
                    sampleRscScript
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#2B7FFF] text-white text-xs font-semibold transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Télécharger</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#162035] border border-[#1E293D] hover:border-[#2B7FFF]/30 transition-all">
              <div>
                <p className="text-xs font-bold text-white">fluxion-vpn-wireguard.conf</p>
                <p className="text-[11px] text-gray-400">Tunnel distant sécurisé pour routeur sans IP publique</p>
              </div>
              <button
                onClick={() =>
                  handleDownload(
                    "fluxion-vpn-wireguard.conf",
                    "fluxion-vpn-wireguard.conf",
                    "[Interface]\nPrivateKey = xxx\nAddress = 10.8.0.2/24\n[Peer]\nPublicKey = yyy\nEndpoint = vpn.fluxionwifi.com:51820"
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#2B7FFF] text-white text-xs font-semibold transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#1F293D] flex items-center justify-between text-xs text-gray-400">
          <span>Besoin d&apos;assistance pour l&apos;installation ?</span>
          <Link href="/services" className="text-amber-400 hover:underline font-semibold">
            Boutique Services &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
