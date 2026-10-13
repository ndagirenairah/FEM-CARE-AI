import { requireUserId } from "@/lib/auth";
import { createChatHandler, RuleBasedChatResponder } from "@/lib/chat-service";

export const dynamic = "force-dynamic";

const handleChatRequest = createChatHandler({
  authenticate: requireUserId,
  responder: new RuleBasedChatResponder(),
});

export async function POST(req: Request) {
  try {
    return await handleChatRequest(req);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
