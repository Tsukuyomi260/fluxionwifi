"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { VpnTunnel } from "@/lib/supabase/types";

export function useVpn() {
  const { user } = useUser();
  const [tunnels, setTunnels] = useState<VpnTunnel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("vpn_tunnels")
      .select("*, router:routers(id, name, ip_address)")
      .order("created_at", { ascending: false });
    setTunnels((data as VpnTunnel[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addTunnel = async (values: Partial<VpnTunnel>) => {
    if (!user) return { error: "Not authenticated" };
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vpn_tunnels")
      .insert({ ...values, owner_id: user.id })
      .select("*, router:routers(id, name, ip_address)")
      .single();
    if (!error && data) setTunnels((prev) => [data as VpnTunnel, ...prev]);
    return { data, error: error?.message || null };
  };

  const deleteTunnel = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("vpn_tunnels").delete().eq("id", id);
    if (!error) setTunnels((prev) => prev.filter((t) => t.id !== id));
    return { error: error?.message || null };
  };

  const connected = tunnels.filter((t) => t.status === "connected").length;
  const disconnected = tunnels.filter((t) => t.status === "disconnected").length;

  return { tunnels, loading, addTunnel, deleteTunnel, connected, disconnected, refetch: fetch };
}
