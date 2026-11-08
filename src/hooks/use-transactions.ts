"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Transaction } from "@/lib/supabase/types";

export function useTransactions() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    setTransactions((data as Transaction[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const balance = transactions.reduce((acc, t) => {
    if (t.status !== "completed") return acc;
    if (["sale", "commission", "topup"].includes(t.type)) return acc + t.amount;
    if (["withdrawal", "refund"].includes(t.type)) return acc - t.amount;
    return acc;
  }, 0);

  const pendingBalance = transactions
    .filter((t) => t.status === "pending" && t.type === "withdrawal")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalRevenue = transactions
    .filter((t) => t.status === "completed" && ["sale", "commission", "topup"].includes(t.type))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalWithdrawn = transactions
    .filter((t) => t.status === "completed" && t.type === "withdrawal")
    .reduce((acc, t) => acc + t.amount, 0);

  const addTransaction = async (values: Omit<Transaction, "id" | "owner_id" | "created_at">) => {
    if (!user) return { error: "Not authenticated" };
    const supabase = createClient();
    const { data, error } = await supabase
      .from("transactions")
      .insert({ ...values, owner_id: user.id })
      .select()
      .single();
    if (!error && data) setTransactions((prev) => [data as Transaction, ...prev]);
    return { data, error: error?.message || null };
  };

  return { transactions, loading, balance, pendingBalance, totalRevenue, totalWithdrawn, addTransaction, refetch: fetch };
}
