"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./config";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = getSupabasePublicEnv();
  if (!env.configured || !env.url || !env.anonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}
