import { setAdminSession, validateAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirectTo") || "/admin/submissions");

  if (!validateAdminPassword(password)) {
    return Response.redirect(new URL(`/admin/submissions?error=1`, request.url), 303);
  }

  await setAdminSession();
  return Response.redirect(new URL(redirectTo, request.url), 303);
}
