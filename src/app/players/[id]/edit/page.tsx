import { redirect, notFound } from "next/navigation";
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
import type { PlayerProfile } from "@/lib/types";

export const metadata = { title: "Edit Player" };

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: player } = await supabase
    .from("player_profiles")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!player) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Edit player profile</h1>
        <p className="text-muted-foreground">{player.player_name}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Player details</CardTitle>
          <CardDescription>Update your player&apos;s information</CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerForm player={player as PlayerProfile} />
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
