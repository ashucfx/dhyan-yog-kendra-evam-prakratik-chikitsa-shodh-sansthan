import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteProduct } from "@/lib/commerce";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return Response.json({ message: "Product id is required." }, { status: 400 });
  }

  try {
    await deleteProduct(id);
    return Response.json({ message: "Product deleted successfully." }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to delete product." },
      { status: 500 }
    );
  }
}
