import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AgeBadge,
  LevelBadge,
  PayBadge,
  RoleBadge,
  StatusBadge,
} from "@/components/status-badges";
import type { AvailabilityPost } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/format";
import { MapPin, Calendar, Clock, Car } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("availability_posts")
    .select("player_profiles(player_name)")
    .eq("id", id)
    .single();
  const player = data?.player_profiles as unknown as { player_name: string } | null;
  return { title: player ? `${player.player_name} available` : "Availability" };
}

export default async function AvailabilityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("availability_posts")
    .select(
      "*, player_profiles(player_name, age_division, team_level, roles, bio), profiles(full_name, phone)"
    )
    .eq("id", id)
    .single();

  if (!post) notFound();

  const typedPost = post as AvailabilityPost & {
    profiles: { full_name: string | null; phone: string | null };
    player_profiles: {
      player_name: string;
      age_division: string;
      team_level: string | null;
      roles: string[];
      bio: string | null;
    };
  };

  const player = typedPost.player_profiles;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-2xl font-bold">
            {player?.player_name ?? "Player"} available
          </h1>
          <StatusBadge status={typedPost.status} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <RoleBadge role={typedPost.available_role} />
          {player?.age_division && <AgeBadge division={player.age_division} />}
          {player?.team_level && <LevelBadge level={player.team_level} />}
          {typedPost.pay_expectation && (
            <PayBadge payType={typedPost.pay_expectation} />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Posted by {typedPost.profiles?.full_name ?? "Parent"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Availability details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {formatDate(typedPost.session_date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {formatTime(typedPost.start_time)}
            {typedPost.end_time && ` – ${formatTime(typedPost.end_time)}`}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {typedPost.city}, {typedPost.state}
          </div>
          {typedPost.can_travel && typedPost.travel_radius_miles && (
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              Will travel up to {typedPost.travel_radius_miles} miles
            </div>
          )}
          {typedPost.has_location_access && typedPost.location_details && (
            <p className="text-muted-foreground">
              Location access: {typedPost.location_details}
            </p>
          )}
          {typedPost.notes && (
            <p className="rounded-md bg-muted p-3">{typedPost.notes}</p>
          )}
          {player?.bio && (
            <p className="text-muted-foreground">
              <strong>About player:</strong> {player.bio}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {/* TODO: In-app messaging — for now show parent name */}
          <p>
            Contact {typedPost.profiles?.full_name ?? "the parent"} to coordinate
            this session.
          </p>
          {typedPost.profiles?.phone && (
            <p className="mt-2">Phone: {typedPost.profiles.phone}</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      <p className="text-sm text-muted-foreground">
        <Link href="/availability" className="underline">
          Back to availability
        </Link>
      </p>
    </div>
  );
}
