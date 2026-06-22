import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayerForm } from "@/components/player-form";

export const metadata = { title: "Add Player" };

export default async function NewPlayerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Add player profile</h1>
        <p className="text-muted-foreground">
          Create a profile for your youth baseball player
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Player details</CardTitle>
          <CardDescription>
            This info helps match your player with rep opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerForm />
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        <Link href="/dashboard" className="underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
