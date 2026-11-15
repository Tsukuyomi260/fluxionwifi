"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Ticket, TicketProfile, TicketStatus } from "@/lib/supabase/types";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function useTickets() {
  const { user } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [profiles, setProfiles] = useState<TicketProfile[]>([]);
  const [loading, setLoading] = useState(true);
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
      const [ticketsRes, profilesRes] = await Promise.all([
        supabase
          .from("tickets")
          .select("*, profile:ticket_profiles(*), seller:sellers(id, name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("ticket_profiles")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

      setTickets((ticketsRes.data as Ticket[]) || []);
      setProfiles((profilesRes.data as TicketProfile[]) || []);
    } catch (err) {
      console.warn("[Tickets] Service notice:", err);
      setTickets([]);
      setProfiles([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const generate = async (profileId: string, quantity: number) => {
    if (!user) return { error: "Not authenticated" };
    try {
      const supabase = createClient();
      const codes = Array.from({ length: quantity }, () => ({
        owner_id: user.id,
        profile_id: profileId,
        code: generateCode(),
        status: "available" as TicketStatus,
      }));

      const { data, error } = await supabase
        .from("tickets")
        .insert(codes)
        .select("*, profile:ticket_profiles(*), seller:sellers(id, name)");

      if (!error && data) {
        setTickets((prev) => [...(data as Ticket[]), ...prev]);
      }
      return { data, error: error?.message || null };
    } catch (err: any) {
      return { data: null, error: err?.message || "Erreur de génération" };
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tickets").delete().eq("id", id);
      if (!error) setTickets((prev) => prev.filter((t) => t.id !== id));
      return { error: error?.message || null };
    } catch (err: any) {
      return { error: err?.message || "Erreur de suppression" };
    }
  };

  const assignToSeller = async (ticketIds: string[], sellerId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tickets")
        .update({ seller_id: sellerId })
        .in("id", ticketIds);
      if (!error) fetch();
      return { error: error?.message || null };
    } catch (err: any) {
      return { error: err?.message || "Erreur d'assignation" };
    }
  };

  const createProfile = async (
    profile: Omit<TicketProfile, "id" | "owner_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return { error: "Not authenticated" };
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ticket_profiles")
        .insert({ ...profile, owner_id: user.id })
        .select()
        .single();
      if (!error && data) setProfiles((prev) => [...prev, data as TicketProfile]);
      return { data, error: error?.message || null };
    } catch (err: any) {
      return { data: null, error: err?.message || "Erreur de création de profil" };
    }
  };

  return {
    tickets,
    profiles,
    loading,
    generate,
    deleteTicket,
    assignToSeller,
    createProfile,
    refetch: fetch,
  };
}
