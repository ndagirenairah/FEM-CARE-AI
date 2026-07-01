import { checkSymptoms } from "@/lib/ai";
import { requireUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await requireUserId();
    const { symptoms } = await req.json();
    if (!symptoms || typeof symptoms !== "string") {
      return Response.json({ error: "Describe your symptoms" }, { status: 400 });
    }
    return Response.json({ result: checkSymptoms(symptoms) });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
