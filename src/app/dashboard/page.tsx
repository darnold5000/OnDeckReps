import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RequestCard } from "@/components/request-card";
import { AvailabilityCard } from "@/components/availability-card";
import { ProfileForm } from "@/components/profile-form";
import type { RepRequest, AvailabilityPost, PlayerProfile } from "@/lib/types";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: players },
    { data: requests },
    { data: availability },
    { data: nearbyRequests },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("player_profiles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("rep_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("availability_posts")
      .select("*, player_profiles(player_name, age_division, team_level)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("rep_requests")
      .select("*, profiles(full_name)")
      .eq("status", "open")
      .neq("user_id", user.id)
      .order("session_date", { ascending: true })
      .limit(3),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}!
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/requests/new" size="sm">
            Create Request
          </ButtonLink>
          <ButtonLink href="/players/new" size="sm" variant="outline">
            Add Player
          </ButtonLink>
          <ButtonLink href="/availability/new" size="sm" variant="outline">
            Post Availability
          </ButtonLink>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parent profile</CardTitle>
          <CardDescription>Your contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      <section id="players" className="scroll-mt-20 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My player profiles</h2>
          <ButtonLink href="/players/new" size="sm" variant="ghost">
            + Add
          </ButtonLink>
        </div>
        {(players as PlayerProfile[])?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(players as PlayerProfile[]).map((player) => (
              <Card key={player.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{player.player_name}</CardTitle>
                    <ButtonLink href={`/players/${player.id}/edit`} size="sm" variant="ghost">
                      Edit
                    </ButtonLink>
                  </div>
                  <CardDescription>
                    {player.age_division} · {player.roles.join(", ")}
                    {player.city && ` · ${player.city}, ${player.state}`}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No players yet.{" "}
            <Link href="/players/new" className="text-primary underline">
              Add your first player
            </Link>
          </p>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My open requests</h2>
          <ButtonLink href="/requests" size="sm" variant="ghost">
            View all
          </ButtonLink>
        </div>
        {(requests as RepRequest[])?.filter((r) => r.status === "open").length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(requests as RepRequest[])
              .filter((r) => r.status === "open")
              .map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No open requests.</p>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My availability posts</h2>
          <ButtonLink href="/availability" size="sm" variant="ghost">
            View all
          </ButtonLink>
        </div>
        {(availability as AvailabilityPost[])?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(availability as AvailabilityPost[]).map((post) => (
              <AvailabilityCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No availability posts.</p>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Browse nearby requests</h2>
          <ButtonLink href="/requests" size="sm" variant="ghost">
            Browse all
          </ButtonLink>
        </div>
        {(nearbyRequests as RepRequest[])?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(nearbyRequests as RepRequest[]).map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No open requests from other families right now.
          </p>
        )}
      </section>
    </div>
  );
}
