"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  INITIAL_LEDGER,
  INITIAL_MESSAGES,
  INITIAL_SALES,
  RESELLER,
  generateCode,
  netCost,
  type ChatMessage,
  type LedgerEntry,
  type ResellerProfileItem,
  type Sale,
} from "@/lib/reseller-data";

interface ResellerState {
  creditUsed: number;
  creditLimit: number;
  available: number;
  sales: Sale[];
  ledger: LedgerEntry[];
  messages: ChatMessage[];
  sell: (profile: ResellerProfileItem) => { ok: true; sale: Sale } | { ok: false; error: string };
  sendMessage: (body: string) => void;
}

const Ctx = createContext<ResellerState | null>(null);

export function useReseller(): ResellerState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useReseller doit être utilisé dans <ResellerProvider>");
  return ctx;
}

let counter = 100;
const nextId = (p: string) => `${p}${++counter}`;

export function ResellerProvider({ children }: { children: ReactNode }) {
  const [creditUsed, setCreditUsed] = useState(RESELLER.initialCreditUsed);
  const creditLimit = RESELLER.creditLimit;
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const sell = useCallback<ResellerState["sell"]>(
    (profile) => {
      const cost = netCost(profile.price, RESELLER.commissionRate);
      if (creditUsed + cost > creditLimit)
        return { ok: false, error: "Limite de crédit atteinte. Réglez votre dette auprès du propriétaire pour continuer." };
      const at = new Date().toISOString();
      const sale: Sale = {
        id: nextId("s"),
        code: generateCode(),
        profileName: profile.name,
        price: profile.price,
        cost,
        at,
      };
      const after = creditUsed + cost;
      setCreditUsed(after);
      setSales((s) => [sale, ...s]);
      setLedger((l) => [
        { id: nextId("l"), type: "sale", amount: cost, debtAfter: after, note: profile.name, at },
        ...l,
      ]);
      return { ok: true, sale };
    },
    [creditUsed, creditLimit]
  );

  const sendMessage = useCallback((body: string) => {
    setMessages((m) => [
      ...m,
      { id: nextId("m"), from: "seller", kind: "message", body, at: new Date().toISOString() },
    ]);
  }, []);

  const value = useMemo(
    () => ({ creditUsed, creditLimit, available: creditLimit - creditUsed, sales, ledger, messages, sell, sendMessage }),
    [creditUsed, creditLimit, sales, ledger, messages, sell, sendMessage]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
