import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import AuthLanding from "@/components/AuthLanding";

export const dynamic = "force-dynamic";

export default async function Home() {
  const userId = await getSessionUserId();
  if (userId) redirect("/dashboard");
  return <AuthLanding />;
}
