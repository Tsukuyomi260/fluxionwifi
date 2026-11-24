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
  balance: number;
  sales: Sale[];
  ledger: LedgerEntry[];
  messages: ChatMessage[];
  sell: (profile: ResellerProfileItem) => { ok: true; sale: Sale } | { ok: false; error: string };
  topUp: (amount: number) => void;
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
  const [balance, setBalance] = useState(RESELLER.initialBalance);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const sell = useCallback<ResellerState["sell"]>(
    (profile) => {
      const cost = netCost(profile.price, RESELLER.commissionRate);
      if (balance < cost) return { ok: false, error: "Crédit insuffisant. Rechargez votre compte." };
      const at = new Date().toISOString();
      const sale: Sale = {
        id: nextId("s"),
        code: generateCode(),
        profileName: profile.name,
        price: profile.price,
        cost,
        at,
      };
      const after = balance - cost;
      setBalance(after);
      setSales((s) => [sale, ...s]);
      setLedger((l) => [
        { id: nextId("l"), type: "sale", amount: -cost, balanceAfter: after, note: profile.name, at },
        ...l,
      ]);
      return { ok: true, sale };
    },
    [balance]
  );

  const topUp = useCallback(
    (amount: number) => {
      const after = balance + amount;
      setBalance(after);
      setLedger((l) => [
        { id: nextId("l"), type: "topup", amount, balanceAfter: after, note: "Recharge", at: new Date().toISOString() },
        ...l,
      ]);
    },
    [balance]
  );

  const sendMessage = useCallback((body: string) => {
    setMessages((m) => [
      ...m,
      { id: nextId("m"), from: "seller", kind: "message", body, at: new Date().toISOString() },
    ]);
  }, []);

  const value = useMemo(
    () => ({ balance, sales, ledger, messages, sell, topUp, sendMessage }),
    [balance, sales, ledger, messages, sell, topUp, sendMessage]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
