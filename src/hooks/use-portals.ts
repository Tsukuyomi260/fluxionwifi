"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Portal, PortalStatus } from "@/lib/supabase/types";

export function usePortals() {
  const { user } = useUser();
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("portals")
      .select("*")
      .order("created_at", { ascending: false });
    setPortals((data as Portal[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addPortal = async (values: Partial<Portal>) => {
    if (!user) return { error: "Not authenticated" };
    const supabase = createClient();
    const { data, error } = await supabase
      .from("portals")
      .insert({ ...values, owner_id: user.id })
      .select()
      .single();
    if (!error && data) setPortals((prev) => [data as Portal, ...prev]);
    return { data, error: error?.message || null };
  };

  const updatePortal = async (id: string, values: Partial<Portal>) => {
    const supabase = createClient();
    const { error } = await supabase.from("portals").update(values).eq("id", id);
    if (!error) setPortals((prev) => prev.map((p) => p.id === id ? { ...p, ...values } : p));
    return { error: error?.message || null };
  };

  const toggleStatus = async (id: string) => {
    const portal = portals.find((p) => p.id === id);
    if (!portal) return;
    const newStatus: PortalStatus = portal.status === "active" ? "inactive" : "active";
    await updatePortal(id, { status: newStatus });
  };

  const deletePortal = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("portals").delete().eq("id", id);
    if (!error) setPortals((prev) => prev.filter((p) => p.id !== id));
    return { error: error?.message || null };
  };

  const duplicatePortal = async (portal: Portal) => {
    await addPortal({
      name: `${portal.name} (copie)`,
      description: portal.description,
      status: "draft",
      theme_name: portal.theme_name,
      theme_color: portal.theme_color,
      auth_methods: portal.auth_methods,
      title: portal.title,
      subtitle: portal.subtitle,
      button_text: portal.button_text,
      language: portal.language,
      border_radius: portal.border_radius,
    });
  };

  return { portals, loading, addPortal, updatePortal, toggleStatus, deletePortal, duplicatePortal, refetch: fetch };
}
