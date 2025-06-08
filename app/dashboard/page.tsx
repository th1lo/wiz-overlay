import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { OverlayConfig } from "@/components/OverlayConfig";
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="outline"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>
        <OverlayConfig userId={session.user?.id} />
      </div>
    </main>
  );
} 