"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Code2, CreditCard, Download, GraduationCap, HardDrive, LayoutGrid, Wifi } from "lucide-react";

const PAY_PAGE = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Paiement FLUXIONWIFI</title></head>
<body>
<h1>Acheter un ticket par Mobile Money</h1>
<p>Cette page sera reliée à votre compte FLUXIONWIFI lors de l'activation du paiement.</p>
</body></html>`;

export default function ConsoleDownloadsPage() {
  const [note, setNote] = useState<string | null>(null);

  function say(m: string) {
    setNote(m);
    setTimeout(() => setNote(null), 4000);
  }

  function save(name: string, content: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/html" }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const card = "flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-5";
  const btnBlue = "inline-flex h-9 items-center gap-2 rounded-md bg-[#2B7FFF] px-3 text-sm font-medium text-white hover:bg-[#1A6BE6]";
  const btnLine = "inline-flex h-9 items-center gap-2 rounded-md border border-[#2B7FFF] bg-white px-3 text-sm font-medium text-[#2B7FFF] hover:bg-[#EBF2FF]";
  const btnYellow = "inline-flex h-9 items-center gap-2 rounded-md bg-amber-400 px-3 text-sm font-semibold text-slate-900 hover:bg-amber-300";

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#1A1D26]">Téléchargements</h1>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white" style={{ borderTop: "3px solid #2B7FFF" }}>
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-5 py-3.5 text-base font-medium text-[#1A1D26]">
          <Download className="h-4 w-4" /> Téléchargements
        </div>
        <div className="p-5">
          <p className="text-sm text-[#374151]">
            Tout ce que vous pouvez télécharger pour votre réseau. Les portails s&apos;ouvrent dans le tableau de bord, qui les génère à votre configuration.
          </p>
          {note && <p className="mt-3 rounded-lg bg-[#EBF2FF] px-3 py-2 text-sm text-[#1A6BE6]">{note}</p>}

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className={card}>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-500 text-white"><Wifi className="h-5 w-5" /></span>
              <h3 className="mt-3 text-lg font-bold text-[#1A1D26]">Portails captifs</h3>
              <p className="mt-1 flex-1 text-sm text-[#4B5563]">Choisissez un des designs avec prévisualisation, puis téléchargez-le à votre configuration.</p>
              <div className="mt-4"><Link href="/portal" className={btnBlue}><LayoutGrid className="h-4 w-4" /> Choisir et télécharger</Link></div>
            </div>

            <div className={card}>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#2B7FFF] text-white"><Code2 className="h-5 w-5" /></span>
              <h3 className="mt-3 text-lg font-bold text-[#1A1D26]">Portail personnalisé</h3>
              <p className="mt-1 flex-1 text-sm text-[#4B5563]">Intégrez le paiement FLUXIONWIFI dans votre propre portail, ou générez la page de paiement à part.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/portal" className={btnLine}><Code2 className="h-4 w-4" /> Intégrer</Link>
                <button onClick={() => { save("page-paiement.html", PAY_PAGE); say("Page de paiement téléchargée."); }} className={btnLine}><CreditCard className="h-4 w-4" /> Page de paiement</button>
              </div>
            </div>

            <div className={card}>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 text-white"><HardDrive className="h-5 w-5" /></span>
              <h3 className="mt-3 text-lg font-bold text-[#1A1D26]">MikHmon</h3>
              <p className="mt-1 flex-1 text-sm text-[#4B5563]">
                Paquet déjà relié à votre compte FLUXIONWIFI : aucune liaison à faire après l&apos;installation.
              </p>
              <div className="mt-4 flex flex-col items-start gap-2">
                <button onClick={() => say("Le paquet Mikhmon Server sera disponible avec le serveur.")} className={btnYellow}><HardDrive className="h-4 w-4" /> Mikhmon Server</button>
                <button onClick={() => say("Le paquet Mikhmon v7.13.5 sera disponible avec le serveur.")} className={btnYellow}><HardDrive className="h-4 w-4" /> Mikhmon v7.13.5</button>
              </div>
            </div>

            <div className={card}>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500 text-white"><BookOpen className="h-5 w-5" /></span>
              <h3 className="mt-3 text-lg font-bold text-[#1A1D26]">Documentation</h3>
              <p className="mt-1 flex-1 text-sm text-[#4B5563]">Guide d&apos;utilisation, installation, dépannage et FAQ, en PDF.</p>
              <div className="mt-4"><button onClick={() => say("La documentation PDF sera disponible avec le serveur.")} className={btnBlue}><Download className="h-4 w-4" /> Télécharger la documentation</button></div>
            </div>

            <div className={card}>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-fuchsia-500 text-white"><GraduationCap className="h-5 w-5" /></span>
              <h3 className="mt-3 text-lg font-bold text-[#1A1D26]">Tutoriels</h3>
              <p className="mt-1 flex-1 text-sm text-[#4B5563]">Tutoriels animés en français : le guide de cette console et tout le catalogue (portail, routeur, revendeurs…).</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/tutorials" className={btnLine}>Tutoriel de cette console</Link>
                <Link href="/tutorials" className={btnLine}>Tous les tutoriels</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
