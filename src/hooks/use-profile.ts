"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Profile } from "@/lib/supabase/types";

export function useProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data as Profile | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const updateProfile = async (values: Partial<Profile>) => {
    if (!user) return { error: "Not authenticated" };

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update(values)
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => prev ? { ...prev, ...values } : null);
    }

    return { error: error?.message || null };
  };

  const regenerateApiKey = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("regenerate_api_key");
    if (!error && data) {
      setProfile((prev) => prev ? { ...prev, api_key: data } : null);
    }
    return { key: data, error: error?.message || null };
  };

  return { profile, loading, updateProfile, regenerateApiKey, refetch: fetch };
}
