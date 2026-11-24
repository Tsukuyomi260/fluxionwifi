"use client";

import { useCallback, useState } from "react";
import {
  INITIAL_MOVEMENTS,
  INITIAL_PARTNERS,
  INITIAL_PARTNER_MESSAGES,
  INITIAL_WITHDRAWALS,
  generatePassword,
  nextLoginId,
  type DebtMovement,
  type Partner,
  type PartnerMessage,
  type Withdrawal,
} from "@/lib/partners-data";

let counter = 1000;
const nid = (p: string) => `${p}${++counter}`;

export interface PartnerInput {
  name: string;
  password?: string;
  creditLimit: number;
  commission: number;
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [movements, setMovements] = useState<DebtMovement[]>(INITIAL_MOVEMENTS);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(INITIAL_WITHDRAWALS);
  const [messages, setMessages] = useState<PartnerMessage[]>(INITIAL_PARTNER_MESSAGES);

  const createPartner = useCallback(
    (input: PartnerInput): Partner => {
      const loginId = nextLoginId(partners.map((p) => p.loginId));
      const partner: Partner = {
        id: nid("r"),
        name: input.name.trim() || loginId,
        loginId,
        password: input.password?.trim() || generatePassword(),
        creditLimit: input.creditLimit,
        creditUsed: 0,
        commission: input.commission,
        status: "active",
      };
      setPartners((ps) => [...ps, partner]);
      return partner;
    },
    [partners]
  );

  const updatePartner = useCallback((id: string, input: Partial<PartnerInput>) => {
    setPartners((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              name: input.name?.trim() ? input.name.trim() : p.name,
              password: input.password?.trim() ? input.password.trim() : p.password,
              creditLimit: input.creditLimit ?? p.creditLimit,
              commission: input.commission ?? p.commission,
            }
          : p
      )
    );
  }, []);

  /** Le propriétaire a encaissé : la dette repasse à zéro. */
  const settle = useCallback(
    (id: string) => {
      const p = partners.find((x) => x.id === id);
      if (!p || p.creditUsed <= 0) return;
      setPartners((ps) => ps.map((x) => (x.id === id ? { ...x, creditUsed: 0 } : x)));
      setMovements((ms) => [
        { id: nid("d"), partnerId: id, type: "payment", amount: -p.creditUsed, note: "Règlement reçu", at: new Date().toISOString() },
        ...ms,
      ]);
    },
    [partners]
  );

  const toggleBlock = useCallback((id: string) => {
    setPartners((ps) => ps.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "blocked" : "active" } : p)));
  }, []);

  const removePartner = useCallback((id: string) => {
    setPartners((ps) => ps.filter((p) => p.id !== id));
    setMovements((ms) => ms.filter((m) => m.partnerId !== id));
    setWithdrawals((ws) => ws.filter((w) => w.partnerId !== id));
    setMessages((ms) => ms.filter((m) => m.partnerId !== id));
  }, []);

  const decideWithdrawal = useCallback((id: string, status: "approved" | "rejected") => {
    setWithdrawals((ws) => ws.map((w) => (w.id === id && w.status === "pending" ? { ...w, status } : w)));
  }, []);

  const sendMessage = useCallback((partnerId: string, body: string) => {
    setMessages((ms) => [...ms, { id: nid("pm"), partnerId, from: "owner", body, at: new Date().toISOString() }]);
  }, []);

  return { partners, movements, withdrawals, messages, createPartner, updatePartner, settle, toggleBlock, removePartner, decideWithdrawal, sendMessage };
}

export type PartnersStore = ReturnType<typeof usePartners>;
