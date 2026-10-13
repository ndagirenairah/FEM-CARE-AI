import { chatReply } from "@/lib/ai";

export interface ChatResponder {
  respond(message: string): string;
}

export interface ChatDependencies {
  authenticate: () => Promise<number>;
  responder: ChatResponder;
}

export class RuleBasedChatResponder implements ChatResponder {
  respond(message: string): string {
    return chatReply(message);
  }
}

export function createChatHandler({ authenticate, responder }: ChatDependencies) {
  return async function handleChatRequest(req: Request): Promise<Response> {
    await authenticate();
    const body: unknown = await req.json();
    const message =
      typeof body === "object" && body !== null && "message" in body && typeof body.message === "string"
        ? body.message
        : null;

    if (!message?.trim()) {
      return Response.json({ error: "Message required" }, { status: 400 });
    }

    return Response.json({ reply: responder.respond(message) });
  };
}
