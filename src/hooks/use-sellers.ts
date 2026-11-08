"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Seller, SellerStatus, StockAssignment } from "@/lib/supabase/types";

export function useSellers() {
  const { user } = useUser();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [assignments, setAssignments] = useState<StockAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const supabase = createClient();

    const [sellersRes, assignRes] = await Promise.all([
      supabase
        .from("sellers")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("stock_assignments")
        .select("*, seller:sellers(id, name), profile:ticket_profiles(id, name, color)")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    setSellers((sellersRes.data as Seller[]) || []);
    setAssignments((assignRes.data as StockAssignment[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addSeller = async (values: { name: string; phone: string; location: string; commission_rate: number }) => {
    if (!user) return { error: "Not authenticated" };
    const supabase = createClient();
    const { data, error } = await supabase
      .from("sellers")
      .insert({ ...values, owner_id: user.id })
      .select()
      .single();
    if (!error && data) setSellers((prev) => [data as Seller, ...prev]);
    return { data, error: error?.message || null };
  };

  const updateSeller = async (id: string, values: Partial<Seller>) => {
    const supabase = createClient();
    const { error } = await supabase.from("sellers").update(values).eq("id", id);
    if (!error) setSellers((prev) => prev.map((s) => s.id === id ? { ...s, ...values } : s));
    return { error: error?.message || null };
  };

  const toggleStatus = async (id: string) => {
    const seller = sellers.find((s) => s.id === id);
    if (!seller) return;
    const newStatus: SellerStatus = seller.status === "active" ? "inactive" : "active";
    await updateSeller(id, { status: newStatus });
  };

  const assignStock = async (sellerId: string, profileId: string, quantity: number) => {
    if (!user) return { error: "Not authenticated" };
    const supabase = createClient();
    const { error } = await supabase
      .from("stock_assignments")
      .insert({
        owner_id: user.id,
        seller_id: sellerId,
        profile_id: profileId,
        quantity,
        type: "assign",
      });
    if (!error) {
      await supabase
        .from("sellers")
        .update({
          stock_remaining: (sellers.find((s) => s.id === sellerId)?.stock_remaining || 0) + quantity,
          total_assigned: (sellers.find((s) => s.id === sellerId)?.total_assigned || 0) + quantity,
        })
        .eq("id", sellerId);
      fetch();
    }
    return { error: error?.message || null };
  };

  return { sellers, assignments, loading, addSeller, updateSeller, toggleStatus, assignStock, refetch: fetch };
}
