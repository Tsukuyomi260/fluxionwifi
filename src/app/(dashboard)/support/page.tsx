"use client";

import { useState, useEffect, useRef } from "react";
import { useSupport } from "@/hooks/use-support";
import type { SupportStatus, SupportMessage } from "@/lib/supabase/types";
import {
  HeadphonesIcon,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Send,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Paperclip,
  Wifi,
  CreditCard,
  Shield,
  Router,
  Settings,
} from "lucide-react";

type TicketPriority = "low" | "medium" | "high";

const statusConfig: Record<SupportStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  open: { label: "Ouvert", color: "text-blue-600", bg: "bg-blue-50", icon: AlertCircle },
  in_progress: { label: "En cours", color: "text-amber-600", bg: "bg-amber-50", icon: Loader2 },
  resolved: { label: "Résolu", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
  closed: { label: "Fermé", color: "text-gray-500", bg: "bg-gray-100", icon: CheckCircle },
};

const priorityConfig: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: "Basse", color: "text-gray-500" },
  medium: { label: "Moyenne", color: "text-amber-600" },
  high: { label: "Haute", color: "text-red-500" },
};

const faqItems = [
  {
    q: "Comment ajouter un nouveau routeur MikroTik ?",
    a: "Allez dans Interopérabilité → Ajouter un routeur. Entrez l'IP, le port API (8728 par défaut) et les identifiants admin. Le routeur sera automatiquement détecté et configuré.",
    icon: Router,
  },
  {
    q: "Comment fonctionne la facturation ?",
    a: "Votre solde est débité automatiquement à chaque renouvellement. Rechargez via Mobile Money ou FedaPay/CinetPay depuis la page Facturation → Recharger.",
    icon: CreditCard,
  },
  {
    q: "Comment personnaliser mon portail captif ?",
    a: "Utilisez le Studio pour créer et modifier vos portails. Vous pouvez changer le logo, les couleurs, les textes, et ajouter des publicités. Chaque portail peut être lié à un ou plusieurs routeurs.",
    icon: Wifi,
  },
  {
    q: "Le VPN est-il inclus dans ma formule ?",
    a: "Le VPN est inclus dans la formule Pro. Pour la formule Starter, vous pouvez l'ajouter en service complémentaire à 500 XOF/mois depuis Facturation → Souscrire.",
    icon: Shield,
  },
  {
    q: "Comment changer de formule d'abonnement ?",
    a: "Allez dans Facturation → Souscrire, choisissez votre nouvelle formule et cliquez Choisir. Le changement prend effet immédiatement, avec un prorata sur le mois en cours.",
    icon: Settings,
  },
];

export default function SupportPage() {
  const { tickets, loading, createTicket, getMessages, sendMessage } = useSupport();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"tickets" | "faq">("tickets");
  const [submitting, setSubmitting] = useState(false);

  // New ticket form
  const [newCategory, setNewCategory] = useState("Technique");
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<TicketPriority>("medium");

  // Thread view
  const [viewTicketId, setViewTicketId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<SupportMessage[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;

  async function handleCreateTicket() {
    if (!newSubject.trim() || !newDescription.trim()) return;
    setSubmitting(true);
    await createTicket({
      subject: newSubject,
      description: newDescription,
      category: newCategory,
      priority: newPriority,
    });
    setSubmitting(false);
    setShowNewTicket(false);
    setNewSubject("");
    setNewDescription("");
    setNewCategory("Technique");
    setNewPriority("medium");
  }

  async function openThread(ticketId: string) {
    setViewTicketId(ticketId);
    setThreadLoading(true);
    const msgs = await getMessages(ticketId);
    setThreadMessages(msgs);
    setThreadLoading(false);
  }

  async function handleSendReply() {
    if (!viewTicketId || !replyText.trim()) return;
    setSending(true);
    const { data } = await sendMessage(viewTicketId, replyText);
    if (data) setThreadMessages((prev) => [...prev, data as SupportMessage]);
    setReplyText("");
    setSending(false);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  const viewTicket = tickets.find((t) => t.id === viewTicketId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B7FFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A1D26]">Support</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Besoin d&apos;aide ? Notre équipe est disponible 7j/7
          </p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          Nouveau ticket
        </button>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setShowChat(true)}
          className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#2B7FFF] hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <MessageCircle className="h-5 w-5 text-[#2B7FFF]" />
            </div>
            <div>
              <p className="font-semibold text-[#1A1D26] text-sm">Chat en direct</p>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                En ligne
              </p>
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">Réponse instantanée. Temps moyen : &lt; 2 min</p>
        </button>

        <a
          href="mailto:support@fluxionwifi.com"
          className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#2B7FFF] hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-violet-50 p-2.5">
              <Mail className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-[#1A1D26] text-sm">Email</p>
              <p className="text-xs text-[#9CA3AF]">support@fluxionwifi.com</p>
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">Réponse sous 24h maximum</p>
        </a>

        <a
          href="https://wa.me/22960000000"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-[#E8ECF1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#2B7FFF] hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <Phone className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-[#1A1D26] text-sm">WhatsApp</p>
              <p className="text-xs text-[#9CA3AF]">+229 60 00 00 00</p>
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">Disponible lun-sam, 8h-20h</p>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-[#F5F7FA] p-1 w-fit">
        <button
          onClick={() => setActiveTab("tickets")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "tickets" ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
          }`}
        >
          Mes tickets
          {openCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2B7FFF] text-[10px] font-bold text-white">
              {openCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("faq")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "faq" ? "bg-white text-[#1A1D26] shadow-sm" : "text-[#6B7280] hover:text-[#1A1D26]"
          }`}
        >
          FAQ
        </button>
      </div>

      {/* Tickets tab */}
      {activeTab === "tickets" && (
        <div className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="p-4 border-b border-[#E8ECF1]">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Rechercher un ticket..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
                />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] pl-3 pr-9 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2B7FFF]/20"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="open">Ouverts</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolus</option>
                  <option value="closed">Fermés</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8ECF1]">
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-4 py-3">Ticket</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-4 py-3">Catégorie</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-4 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-4 py-3">Priorité</th>
                  <th className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-4 py-3">Créé le</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const st = statusConfig[t.status];
                  const pr = priorityConfig[(t.priority || "medium") as TicketPriority];
                  return (
                    <tr key={t.id} className="border-b border-[#F1F3F7] last:border-0 hover:bg-[#FAFBFC] transition-colors">
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-[#1A1D26]">{t.subject}</p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">{t.description?.slice(0, 60)}{(t.description?.length || 0) > 60 ? "..." : ""}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-[#6B7280]">{t.category || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg ${st.bg} px-2.5 py-1 text-xs font-medium ${st.color}`}>
                          <st.icon className="h-3 w-3" />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm font-medium ${pr?.color || "text-gray-500"}`}>{pr?.label || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#9CA3AF]" />
                          <span className="text-sm text-[#6B7280]">{new Date(t.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => openThread(t.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#E8ECF1] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F5F7FA]"
                        >
                          Voir <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-[#F1F3F7]">
            {filtered.map((t) => {
              const st = statusConfig[t.status];
              const pr = priorityConfig[(t.priority || "medium") as TicketPriority];
              return (
                <div key={t.id} className="p-4 cursor-pointer" onClick={() => openThread(t.id)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1A1D26]">{t.subject}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{new Date(t.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-lg ${st.bg} px-2 py-0.5 text-xs font-medium ${st.color} shrink-0 ml-2`}>
                      <st.icon className="h-3 w-3" />
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                    <span>{t.category || "—"}</span>
                    <span>·</span>
                    <span className={pr?.color || "text-gray-500"}>Priorité {pr?.label?.toLowerCase() || "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <HeadphonesIcon className="h-10 w-10 text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-sm text-[#6B7280]">Aucun ticket trouvé</p>
            </div>
          )}
        </div>
      )}

      {/* FAQ tab */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E8ECF1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#FAFBFC] transition-colors"
              >
                <div className="rounded-xl bg-blue-50 p-2 shrink-0">
                  <item.icon className="h-4 w-4 text-[#2B7FFF]" />
                </div>
                <span className="flex-1 text-sm font-medium text-[#1A1D26]">{item.q}</span>
                <ChevronDown className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 shrink-0 ${expandedFaq === i ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 pb-4 pl-[60px]">
                  <p className="text-sm text-[#6B7280] leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New ticket modal */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNewTicket(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
              <h2 className="text-lg font-semibold text-[#1A1D26]">Nouveau ticket</h2>
              <button onClick={() => setShowNewTicket(false)} className="rounded-lg p-1.5 hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Catégorie</label>
                <div className="relative">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#E8ECF1] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 pr-9"
                  >
                    <option>Technique</option>
                    <option>Facturation</option>
                    <option>Compte</option>
                    <option>Autre</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Sujet</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Décrivez brièvement votre problème"
                  className="w-full rounded-xl border border-[#E8ECF1] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 placeholder:text-[#9CA3AF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Détaillez votre demande..."
                  className="w-full rounded-xl border border-[#E8ECF1] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 resize-none placeholder:text-[#9CA3AF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Priorité</label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as TicketPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 rounded-xl border-2 text-center py-2 text-sm font-medium transition-colors ${
                        newPriority === p
                          ? "border-[#2B7FFF] bg-[#EBF2FF]/30"
                          : "border-[#E8ECF1] hover:border-[#D1D5DB]"
                      } ${priorityConfig[p].color}`}
                    >
                      {priorityConfig[p].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E8ECF1] flex gap-3">
              <button
                onClick={() => setShowNewTicket(false)}
                className="flex-1 h-10 rounded-xl border border-[#E8ECF1] text-sm font-medium text-[#374151] hover:bg-[#F5F7FA] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={!newSubject.trim() || !newDescription.trim() || submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-[#2B7FFF] text-sm font-medium text-white hover:bg-[#1A6BE6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thread modal */}
      {viewTicketId && viewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setViewTicketId(null); setThreadMessages([]); }} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: "80vh" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1] shrink-0">
              <div>
                <h3 className="text-base font-semibold text-[#1A1D26]">{viewTicket.subject}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {(() => {
                    const st = statusConfig[viewTicket.status];
                    return (
                      <span className={`inline-flex items-center gap-1 rounded-lg ${st.bg} px-2 py-0.5 text-[11px] font-medium ${st.color}`}>
                        <st.icon className="h-3 w-3" />
                        {st.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs text-[#9CA3AF]">{viewTicket.category}</span>
                </div>
              </div>
              <button onClick={() => { setViewTicketId(null); setThreadMessages([]); }} className="p-1.5 rounded-lg hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F5F7FA]">
              {threadLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#2B7FFF]" />
                </div>
              ) : threadMessages.length === 0 ? (
                <div className="rounded-xl bg-white border border-[#E8ECF1] p-4">
                  <p className="text-sm text-[#6B7280]">{viewTicket.description}</p>
                  <p className="text-xs text-[#9CA3AF] mt-2">{new Date(viewTicket.created_at).toLocaleString("fr-FR")}</p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-white border border-[#E8ECF1] p-4">
                    <p className="text-sm text-[#6B7280]">{viewTicket.description}</p>
                    <p className="text-xs text-[#9CA3AF] mt-2">{new Date(viewTicket.created_at).toLocaleString("fr-FR")}</p>
                  </div>
                  {threadMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
                        msg.sender_type === "user"
                          ? "bg-[#2B7FFF] text-white rounded-br-md"
                          : "bg-white border border-[#E8ECF1] text-[#1A1D26] rounded-bl-md"
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender_type === "user" ? "text-white/60" : "text-[#9CA3AF]"}`}>
                          {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-[#E8ECF1] bg-white shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                  placeholder="Tapez votre message..."
                  className="flex-1 h-10 rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-4 text-sm focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 placeholder:text-[#9CA3AF]"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sending}
                  className="h-10 px-4 rounded-xl bg-[#2B7FFF] text-white hover:bg-[#1A6BE6] transition-colors disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live chat widget */}
      {showChat && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] rounded-2xl bg-white border border-[#E8ECF1] shadow-2xl overflow-hidden flex flex-col" style={{ height: "500px" }}>
          <div className="bg-gradient-to-r from-[#0B1E4D] to-[#1A3A7A] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <HeadphonesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Support FLUXIONWIFI</p>
                <p className="text-xs text-white/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  En ligne
                </p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="rounded-lg p-1 hover:bg-white/10">
              <X className="h-4 w-4 text-white/70" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F7FA]">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2B7FFF] flex items-center justify-center shrink-0">
                <HeadphonesIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <div className="rounded-2xl rounded-tl-md bg-white border border-[#E8ECF1] px-3.5 py-2.5 max-w-[260px]">
                  <p className="text-sm text-[#1A1D26]">
                    Bonjour ! Comment puis-je vous aider aujourd&apos;hui ?
                  </p>
                </div>
                <p className="text-[10px] text-[#9CA3AF] mt-1 ml-1">Maintenant</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pl-9">
              {["Problème technique", "Question facturation", "Autre demande"].map((q) => (
                <button key={q} className="rounded-xl border border-[#2B7FFF] px-3 py-1.5 text-xs font-medium text-[#2B7FFF] hover:bg-blue-50 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-[#E8ECF1] bg-white shrink-0">
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 hover:bg-[#F5F7FA] text-[#9CA3AF]">
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                type="text"
                placeholder="Tapez votre message..."
                className="flex-1 rounded-xl border border-[#E8ECF1] bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF]/20 placeholder:text-[#9CA3AF]"
              />
              <button className="rounded-xl bg-[#2B7FFF] p-2 text-white hover:bg-[#1A6BE6] transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
