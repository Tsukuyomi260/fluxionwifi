"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Router, RouterStatus } from "@/lib/supabase/types";

export function useRouters() {
  const { user } = useUser();
  const [routers, setRouters] = useState<Router[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("routers")
      .select("*")
      .order("created_at", { ascending: false });
    setRouters((data as Router[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addRouter = async (values: Partial<Router>) => {
    if (!user) return { error: "Not authenticated" };
    const supabase = createClient();
    const { data, error } = await supabase
      .from("routers")
      .insert({ ...values, owner_id: user.id })
      .select()
      .single();
    if (!error && data) setRouters((prev) => [data as Router, ...prev]);
    return { data, error: error?.message || null };
  };

  const updateRouter = async (id: string, values: Partial<Router>) => {
    const supabase = createClient();
    const { error } = await supabase.from("routers").update(values).eq("id", id);
    if (!error) setRouters((prev) => prev.map((r) => r.id === id ? { ...r, ...values } : r));
    return { error: error?.message || null };
  };

  const deleteRouter = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("routers").delete().eq("id", id);
    if (!error) setRouters((prev) => prev.filter((r) => r.id !== id));
    return { error: error?.message || null };
  };

  const online = routers.filter((r) => r.status === "online").length;
  const offline = routers.filter((r) => r.status === "offline").length;
  const warning = routers.filter((r) => r.status === "warning").length;

  return { routers, loading, addRouter, updateRouter, deleteRouter, online, offline, warning, refetch: fetch };
}
