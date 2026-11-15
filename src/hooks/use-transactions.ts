"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Transaction } from "@/lib/supabase/types";

export function useTransactions() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetch = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) {
        console.warn("[Transactions] Supabase query notice:", queryError.message || queryError);
        setError(queryError.message || "Erreur de chargement");
        setTransactions([]);
      } else {
        setError(null);
        setTransactions((data as Transaction[]) || []);
      }
    } catch (err: any) {
      console.warn("[Transactions] Network or server unavailable:", err?.message || err);
      setError(err?.message || "Service momentanément indisponible");
      setTransactions([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

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
    try {
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("transactions")
        .insert({ ...values, owner_id: user.id })
        .select()
        .single();
      if (!insertError && data) {
        setTransactions((prev) => [data as Transaction, ...prev]);
      }
      return { data, error: insertError?.message || null };
    } catch (err: any) {
      return { data: null, error: err?.message || "Impossible d'ajouter la transaction" };
    }
  };

  return {
    transactions,
    loading,
    error,
    balance,
    pendingBalance,
    totalRevenue,
    totalWithdrawn,
    addTransaction,
    refetch: fetch,
  };
}
