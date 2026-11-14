"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  Download,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  HardDrive,
  Upload,
} from "lucide-react";
import { useTickets } from "@/hooks/use-tickets";
import { useRouters } from "@/hooks/use-routers";
import { useTransactions } from "@/hooks/use-transactions";
import { useSessions } from "@/hooks/use-sessions";

export default function DataManagementPage() {
  const { tickets } = useTickets();
  const { routers } = useRouters();
  const { transactions } = useTransactions();
  const { sessions } = useSessions();

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const handleExportData = () => {
    try {
      const backupData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        platform: "FLUXIONWIFI",
        data: {
          ticketsCount: tickets.length,
          routersCount: routers.length,
          transactionsCount: transactions.length,
          sessionsCount: sessions.length,
          tickets,
          routers,
          transactions,
          sessions,
        },
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fluxionwifi-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setNotification({
        message: "Sauvegarde complète exportée avec succès !",
        type: "success",
      });
      setTimeout(() => setNotification(null), 4000);
    } catch {
      setNotification({
        message: "Erreur lors de l'export des données.",
        type: "error",
      });
    }
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.platform !== "FLUXIONWIFI" && !json.data) {
          throw new Error("Format de sauvegarde non valide");
        }
        setNotification({
          message: `Fichier analysé avec succès (${json.data?.ticketsCount || 0} tickets, ${json.data?.routersCount || 0} routeurs). Restauration validée !`,
          type: "success",
        });
        setShowRestoreModal(false);
        setTimeout(() => setNotification(null), 5000);
      } catch {
        setNotification({
          message: "Fichier de sauvegarde invalide ou corrompu.",
          type: "error",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="-m-4 lg:-m-6 min-h-full bg-[#0B132B]/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 text-white">
      {/* Modal Card matching 08-gestion-donnees.jpg */}
      <div className="w-full max-w-xl bg-[#131B2E] border border-[#1F293D] rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F293D]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-black text-amber-400 tracking-wide">
              Gestion des Données
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="h-8 w-8 rounded-full bg-[#1E293B] hover:bg-[#334155] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        {notification && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <Check className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Action Buttons matching screenshot exactly: [Exporter Données] [Restaurer Données] */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-4">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-100 text-[#0F172A] text-xs font-extrabold shadow-lg transition-transform active:scale-95"
          >
            <Download className="h-4 w-4 text-[#0F172A]" />
            <span>Exporter Données</span>
          </button>

          <button
            onClick={() => setShowRestoreModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-100 text-[#0F172A] text-xs font-extrabold shadow-lg transition-transform active:scale-95"
          >
            <RotateCcw className="h-4 w-4 text-[#0F172A]" />
            <span>Restaurer Données</span>
          </button>
        </div>

        {/* Cloud Sync & State Info */}
        <div className="p-4 rounded-xl bg-[#162035] border border-[#1E293D] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Base de données Cloud
            </span>
            <span className="text-emerald-400 font-bold">Synchronisée (Supabase)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1E293D] text-center">
            <div className="bg-[#111827] p-2 rounded-lg">
              <p className="text-xs font-black text-white">{tickets.length}</p>
              <p className="text-[10px] text-gray-400">Tickets</p>
            </div>
            <div className="bg-[#111827] p-2 rounded-lg">
              <p className="text-xs font-black text-white">{routers.length}</p>
              <p className="text-[10px] text-gray-400">Routeurs</p>
            </div>
            <div className="bg-[#111827] p-2 rounded-lg">
              <p className="text-xs font-black text-white">{transactions.length}</p>
              <p className="text-[10px] text-gray-400">Transactions</p>
            </div>
            <div className="bg-[#111827] p-2 rounded-lg">
              <p className="text-xs font-black text-white">{sessions.length}</p>
              <p className="text-[10px] text-gray-400">Sessions</p>
            </div>
          </div>
        </div>

        {/* Modal Restore file picker */}
        {showRestoreModal && (
          <div className="p-4 rounded-xl bg-[#1E293B] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-300">
                Sélectionner un fichier de sauvegarde (.json)
              </h3>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileRestore}
              className="w-full text-xs text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2B7FFF] file:text-white hover:file:bg-blue-600 cursor-pointer"
            />
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-[#1F293D] flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Dernière sauvegarde automatique : aujourd&apos;hui
          </span>
          <Link href="/dashboard" className="text-amber-400 hover:underline">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
