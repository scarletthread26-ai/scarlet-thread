"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface RealtimeOptions<T extends { [key: string]: any } = any> {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string; // e.g. "id=eq.some-uuid"
  schema?: string; // defaults to "public"
  enabled?: boolean;
  onPayload: (payload: RealtimePostgresChangesPayload<T>) => void;
}

export function useRealtime<T extends { [key: string]: any } = any>({
  table,
  event = "*",
  filter,
  schema = "public",
  enabled = true,
  onPayload,
}: RealtimeOptions<T>) {
  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();

    // Create unique channel identifier to prevent collision between multiple hook instances
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const channelId = `db-changes-${schema}-${table}-${event}-${filter || "all"}-${uniqueId}`;

    const channel = supabase
      .channel(channelId)
      .on<T>(
        "postgres_changes",
        {
          event,
          schema,
          table,
          filter,
        },
        (payload) => {
          onPayload(payload);
        }
      )
      .subscribe();

    // Clean up the channel on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, filter, schema, enabled, onPayload]);
}
