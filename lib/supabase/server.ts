import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseServerEnv } from "./config";

export async function getSupabaseServerClient() {
  const env = getSupabaseServerEnv();
  if (!env.configured || !env.url || !env.anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server components may attempt cookie writes during render; ignore there.
        }
      }
    }
  });
}
