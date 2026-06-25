import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import { EmptyState } from "@/components/empty-state";
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

  const openRequests = (requests as RepRequest[])?.filter((r) => r.status === "open") ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}!
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <ButtonLink href="/requests/new" size="sm" className="min-h-11 w-full sm:w-auto">
            Post a Request
          </ButtonLink>
          <ButtonLink
            href="/availability/new"
            size="sm"
            variant="outline"
            className="min-h-11 w-full sm:w-auto"
          >
            Share Availability
          </ButtonLink>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parent profile</CardTitle>
          <CardDescription>Your contact information for other families</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      <section id="players" className="scroll-mt-24 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My player profiles</h2>
          <ButtonLink href="/players/new" size="sm" variant="ghost" className="min-h-11">
            + Add
          </ButtonLink>
        </div>
        {(players as PlayerProfile[])?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(players as PlayerProfile[]).map((player) => (
              <Card key={player.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{player.player_name}</CardTitle>
                    <ButtonLink
                      href={`/players/${player.id}/edit`}
                      size="sm"
                      variant="ghost"
                      className="min-h-11"
                    >
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
          <EmptyState
            title="No players added yet"
            description="Add your player so you can post availability or respond to requests."
            actionLabel="Add Player"
            actionHref="/players/new"
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My open requests</h2>
          <ButtonLink href="/requests" size="sm" variant="ghost" className="min-h-11">
            View all
          </ButtonLink>
        </div>
        {openRequests.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {openRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No open requests"
            description="Post a live AB, bullpen, or catcher need and let nearby families respond."
            actionLabel="Post a Request"
            actionHref="/requests/new"
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My availability posts</h2>
          <ButtonLink href="/availability" size="sm" variant="ghost" className="min-h-11">
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
          <EmptyState
            title="No availability posted"
            description="Share when your player is free for pitching, hitting, or catching reps."
            actionLabel="Share Availability"
            actionHref="/availability/new"
            actionVariant="outline"
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Browse nearby requests</h2>
          <ButtonLink href="/requests" size="sm" variant="ghost" className="min-h-11">
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
          <EmptyState
            title="No nearby requests right now"
            description="Check back soon or post your own need to get the ball rolling."
            actionLabel="Post a Request"
            actionHref="/requests/new"
            actionVariant="outline"
          />
        )}
      </section>
    </div>
  );
}
