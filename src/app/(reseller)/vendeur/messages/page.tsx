"use client";

import { useEffect, useRef, useState } from "react";
import { Megaphone, MessageSquare, Send } from "lucide-react";
import { useReseller } from "@/components/reseller/reseller-context";
import { formatDate } from "@/lib/reseller-data";

export default function MessagesPage() {
  const { messages, sendMessage } = useReseller();
  const [tab, setTab] = useState<"discussion" | "announcements">("discussion");
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const list = messages.filter((m) => (tab === "announcements" ? m.kind === "announcement" : m.kind === "message"));

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [list.length, tab]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    sendMessage(body);
    setText("");
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#0B1E4D]">Messages</h1>

      <div className="inline-flex rounded-xl border border-[#E5E7EB] bg-white p-1 text-sm font-medium">
        {[
          { key: "discussion", label: "Discussion", icon: MessageSquare },
          { key: "announcements", label: "Annonces", icon: Megaphone },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              tab === t.key ? "bg-[#2B7FFF] text-white" : "text-[#4B5563] hover:bg-[#F5F7FA]"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="flex h-[55vh] flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {list.length === 0 && <p className="py-10 text-center text-sm text-[#6B7280]">Aucun message.</p>}
          {list.map((m) => {
            const mine = m.from === "seller";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    mine ? "rounded-br-sm bg-[#2B7FFF] text-white" : "rounded-bl-sm bg-[#F0F2F5] text-[#1A1D26]"
                  }`}
                >
                  {m.kind === "announcement" && (
                    <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase opacity-70">
                      <Megaphone className="h-3 w-3" /> Annonce
                    </p>
                  )}
                  <p>{m.body}</p>
                  <p className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-[#9CA3AF]"}`}>{formatDate(m.at)}</p>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {tab === "discussion" && (
          <form onSubmit={submit} className="flex gap-2 border-t border-[#E5E7EB] p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrire au propriétaire…"
              className="h-11 flex-1 rounded-xl border border-[#D1D5DB] px-4 text-sm focus:border-[#2B7FFF] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20"
            />
            <button type="submit" aria-label="Envoyer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2B7FFF] text-white hover:bg-[#1A6BE6]">
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
