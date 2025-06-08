import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { OverlayConfig } from "@/components/OverlayConfig";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-zinc-400">
              Logged in as {session.user?.name}
            </span>
          </div>
        </div>
        <OverlayConfig userId={session.user?.id} />
      </div>
    </main>
  );
} 