import { deleteSubmission } from "@/lib/submissions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return Response.redirect(new URL("/admin/submissions?error=invalid", request.url), 303);
  }

  const formData = await request.formData();
  const id = String(formData.get("id") || "").trim();

  if (!id) {
    return Response.redirect(new URL("/admin/submissions?delete=missing", request.url), 303);
  }

  try {
    await deleteSubmission(id);
  } catch {
    return Response.redirect(new URL("/admin/submissions?delete=failed", request.url), 303);
  }

  return Response.redirect(new URL("/admin/submissions?delete=success", request.url), 303);
}
