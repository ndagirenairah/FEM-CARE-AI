import { chatReply } from "@/lib/ai";
import { requireUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await requireUserId();
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message required" }, { status: 400 });
    }
    return Response.json({ reply: chatReply(message) });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
