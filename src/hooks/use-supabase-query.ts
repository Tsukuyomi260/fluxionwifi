"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";

interface UseQueryResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSupabaseQuery<T>(
  table: string,
  options?: {
    select?: string;
    orderBy?: string;
    ascending?: boolean;
    filters?: Record<string, unknown>;
    enabled?: boolean;
  }
): UseQueryResult<T> {
  const { user } = useUser();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    let query = supabase
      .from(table)
      .select(options?.select || "*");

    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? false,
      });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data: result, error: err } = await query;

    if (err) {
      setError(err.message);
      setData([]);
    } else {
      setData((result as T[]) || []);
    }
    setLoading(false);
  }, [user, table, options?.select, options?.orderBy, options?.ascending, options?.filters, options?.enabled]);

  useEffect(() => {
    if (options?.enabled === false) return;
    fetch();
  }, [fetch, options?.enabled]);

  return { data, loading, error, refetch: fetch };
}

export function useSupabaseInsert<T>(table: string) {
  const supabase = createClient();

  return async (values: Partial<T> | Partial<T>[]): Promise<{ data: T[] | null; error: string | null }> => {
    const { data, error } = await supabase
      .from(table)
      .insert(values as Record<string, unknown>[])
      .select();

    return {
      data: data as T[] | null,
      error: error?.message || null,
    };
  };
}

export function useSupabaseUpdate<T>(table: string) {
  const supabase = createClient();

  return async (id: string, values: Partial<T>): Promise<{ data: T | null; error: string | null }> => {
    const { data, error } = await supabase
      .from(table)
      .update(values as Record<string, unknown>)
      .eq("id", id)
      .select()
      .single();

    return {
      data: data as T | null,
      error: error?.message || null,
    };
  };
}

export function useSupabaseDelete(table: string) {
  const supabase = createClient();

  return async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    return { error: error?.message || null };
  };
}
