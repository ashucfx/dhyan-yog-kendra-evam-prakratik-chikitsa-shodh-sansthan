import { deleteSubmission } from "@/lib/submissions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const id = String(formData.get("id") || "").trim();

  if (!id) {
    return Response.json({ message: "Submission id was missing from the delete request." }, { status: 400 });
  }

  try {
    await deleteSubmission(id);
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Unable to delete the submission right now."
      },
      { status: 500 }
    );
  }

  return Response.json({ message: "Submission deleted successfully." }, { status: 200 });
}
