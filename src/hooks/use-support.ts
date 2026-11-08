"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { SupportTicket, SupportMessage } from "@/lib/supabase/types";

export function useSupport() {
  const { user } = useUser();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });
    setTickets((data as SupportTicket[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const createTicket = async (values: { subject: string; description: string; category: string; priority: string }) => {
    if (!user) return { error: "Not authenticated" };
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({ ...values, owner_id: user.id })
      .select()
      .single();
    if (!error && data) setTickets((prev) => [data as SupportTicket, ...prev]);
    return { data, error: error?.message || null };
  };

  const getMessages = async (ticketId: string): Promise<SupportMessage[]> => {
    const supabase = createClient();
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    return (data as SupportMessage[]) || [];
  };

  const sendMessage = async (ticketId: string, message: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_messages")
      .insert({ ticket_id: ticketId, sender_type: "user", message })
      .select()
      .single();
    return { data, error: error?.message || null };
  };

  return { tickets, loading, createTicket, getMessages, sendMessage, refetch: fetch };
}
