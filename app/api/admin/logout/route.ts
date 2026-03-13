import { clearAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  await clearAdminSession();
  return Response.redirect(new URL("/admin/submissions", request.url), 303);
}
