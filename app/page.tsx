import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to OBS Overlays
        </h1>
        <p className="text-center mb-8">
          Create beautiful, customizable overlays for your Twitch stream
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => signIn("twitch", { callbackUrl: "/dashboard" })}
            className="bg-[#9146FF] hover:bg-[#7c3cda] text-white"
          >
            Sign in with Twitch
          </Button>
        </div>
      </div>
    </main>
  );
}