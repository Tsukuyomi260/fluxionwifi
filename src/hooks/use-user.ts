"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

let cachedUser: User | null = null;
let isInitialFetched = false;
const listeners = new Set<(u: User | null) => void>();

function notifyListeners(user: User | null) {
  cachedUser = user;
  listeners.forEach((listener) => listener(user));
}

let authSubscriptionInitialized = false;

function initAuth() {
  if (typeof window === "undefined" || authSubscriptionInitialized) return;
  authSubscriptionInitialized = true;

  const supabase = createClient();

  supabase.auth
    .getUser()
    .then((res: { data: { user: User | null }; error: any }) => {
      isInitialFetched = true;
      if (!res.error && res.data?.user) {
        notifyListeners(res.data.user);
      } else {
        notifyListeners(null);
      }
    })
    .catch(() => {
      isInitialFetched = true;
      notifyListeners(null);
    });

  supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
    isInitialFetched = true;
    notifyListeners(session?.user ?? null);
  });
}

export function useUser() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!isInitialFetched);

  useEffect(() => {
    initAuth();

    function handleChange(newUser: User | null) {
      setUser(newUser);
      setLoading(false);
    }

    listeners.add(handleChange);

    if (isInitialFetched) {
      setUser(cachedUser);
      setLoading(false);
    }

    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.nom ||
    user?.email?.split("@")[0] ||
    "Utilisateur";

  return { user, loading, displayName };
}
