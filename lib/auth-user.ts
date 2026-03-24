import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
};

export async function getAuthenticatedUser() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    name: String(data.user.user_metadata?.full_name ?? ""),
    phone: String(data.user.user_metadata?.phone ?? "")
  } satisfies AuthenticatedUser;
}
