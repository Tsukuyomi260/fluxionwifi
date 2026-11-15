"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Router } from "@/lib/supabase/types";

export function useRouters() {
  const { user } = useUser();
  const [routers, setRouters] = useState<Router[]>([]);
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
      const { data, error } = await supabase
        .from("routers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRouters(data as Router[]);
      } else {
        setRouters([]);
      }
    } catch (err) {
      console.warn("[Routers] Service notice:", err);
      setRouters([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addRouter = async (values: Partial<Router>) => {
    if (!user) return { error: "Not authenticated" };
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("routers")
        .insert({ ...values, owner_id: user.id })
        .select()
        .single();
      if (!error && data) setRouters((prev) => [data as Router, ...prev]);
      return { data, error: error?.message || null };
    } catch (err: any) {
      return { data: null, error: err?.message || "Erreur d'ajout de routeur" };
    }
  };

  const updateRouter = async (id: string, values: Partial<Router>) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("routers").update(values).eq("id", id);
      if (!error) setRouters((prev) => prev.map((r) => (r.id === id ? { ...r, ...values } : r)));
      return { error: error?.message || null };
    } catch (err: any) {
      return { error: err?.message || "Erreur de mise à jour" };
    }
  };

  const deleteRouter = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("routers").delete().eq("id", id);
      if (!error) setRouters((prev) => prev.filter((r) => r.id !== id));
      return { error: error?.message || null };
    } catch (err: any) {
      return { error: err?.message || "Erreur de suppression" };
    }
  };

  const online = routers.filter((r) => r.status === "online").length;
  const offline = routers.filter((r) => r.status === "offline").length;
  const warning = routers.filter((r) => r.status === "warning").length;

  return {
    routers,
    loading,
    addRouter,
    updateRouter,
    deleteRouter,
    online,
    offline,
    warning,
    refetch: fetch,
  };
}
