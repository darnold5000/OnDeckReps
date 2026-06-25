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
import { AvailabilityForm } from "@/components/availability-form";
import { SafetyNotice } from "@/components/safety-notice";
import type { PlayerProfile } from "@/lib/types";

export const metadata = { title: "Post Availability" };

export default async function NewAvailabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: players } = await supabase
    .from("player_profiles")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Post availability</h1>
        <p className="text-muted-foreground">
          Let families know when your player is available
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Availability details</CardTitle>
          <CardDescription>
            Share when and where your player can provide reps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityForm players={(players as PlayerProfile[]) ?? []} />
        </CardContent>
      </Card>
      <SafetyNotice />
      <p className="text-sm text-muted-foreground">
        <Link href="/dashboard" className="underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
