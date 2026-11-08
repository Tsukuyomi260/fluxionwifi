"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Session } from "@/lib/supabase/types";

export function useSessions() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(100);
    setSessions((data as Session[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const activeSessions = sessions.filter((s) => s.is_active);
  const totalBytesIn = sessions.reduce((acc, s) => acc + s.bytes_in, 0);
  const totalBytesOut = sessions.reduce((acc, s) => acc + s.bytes_out, 0);

  return { sessions, activeSessions, loading, totalBytesIn, totalBytesOut, refetch: fetch };
}
