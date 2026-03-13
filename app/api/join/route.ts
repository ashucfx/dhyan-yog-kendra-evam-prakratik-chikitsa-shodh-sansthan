import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

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

const dataDirectory = join(process.cwd(), "data");
const dataFile = join(dataDirectory, "join-submissions.json");

async function readEntries() {
  try {
    const content = await readFile(dataFile, "utf8");
    return JSON.parse(content) as Array<Record<string, string>>;
  } catch {
    return [];
  }
}

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

  await mkdir(dataDirectory, { recursive: true });
  const entries = await readEntries();
  entries.push(entry);
  await writeFile(dataFile, JSON.stringify(entries, null, 2), "utf8");

  return Response.json({ message: "Your details have been saved." }, { status: 201 });
}
