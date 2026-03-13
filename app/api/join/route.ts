import { sendSubmissionNotification } from "@/lib/notifications";
import { saveSubmission } from "@/lib/submissions";

type JoinPayload = {
  name?: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  condition?: string;
  batchType?: string;
  goal?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as JoinPayload;

  if (!payload.name || !payload.phone || !payload.email || !payload.bloodGroup || !payload.condition || !payload.batchType || !payload.goal) {
    return Response.json({ message: "Please fill in the required details so we can place you properly." }, { status: 400 });
  }

  const entry = {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    bloodGroup: payload.bloodGroup.trim(),
    condition: payload.condition.trim(),
    batchType: payload.batchType.trim(),
    goal: payload.goal.trim(),
    notes: payload.notes?.trim() || "",
    createdAt: new Date().toISOString()
  };

  const storage = await saveSubmission(entry);
  await sendSubmissionNotification(entry);

  return Response.json(
    {
      message: "Your details have been saved.",
      storage
    },
    { status: 201 }
  );
}
