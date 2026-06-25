import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonLink } from "@/components/button-link";
import { DetailSummary } from "@/components/detail-summary";
import {
  AgeBadge,
  LevelBadge,
  LocationAccessBadge,
  PayBadge,
  RoleBadge,
  StatusBadge,
} from "@/components/status-badges";
import { SafetyNotice } from "@/components/safety-notice";
import type { AvailabilityPost } from "@/lib/types";
import { formatDate, formatPayType, formatTime } from "@/lib/format";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  const title = `${player?.player_name ?? "Player"} available as ${typedPost.available_role}`;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <DetailSummary
        title={title}
        badge={<StatusBadge status={typedPost.status} />}
        chips={
          <>
            <RoleBadge role={typedPost.available_role} />
            {player?.age_division && <AgeBadge division={player.age_division} />}
            {player?.team_level && <LevelBadge level={player.team_level} />}
            <LocationAccessBadge hasAccess={typedPost.has_location_access} />
            {typedPost.pay_expectation && (
              <PayBadge payType={typedPost.pay_expectation} />
            )}
          </>
        }
        rows={[
          {
            label: "Date",
            value: formatDate(typedPost.session_date),
          },
          {
            label: "Time",
            value: `${formatTime(typedPost.start_time)}${
              typedPost.end_time ? ` – ${formatTime(typedPost.end_time)}` : ""
            }`,
          },
          {
            label: "Location",
            value: `${typedPost.city}, ${typedPost.state}`,
          },
          {
            label: "Travel",
            value:
              typedPost.can_travel && typedPost.travel_radius_miles
                ? `Up to ${typedPost.travel_radius_miles} miles`
                : "Local only",
          },
          {
            label: "Field access",
            value: typedPost.has_location_access
              ? typedPost.location_details || "Yes"
              : "No",
          },
          {
            label: "Pay",
            value: typedPost.pay_expectation
              ? formatPayType(typedPost.pay_expectation)
              : "Open",
          },
        ]}
      />

      <div className="sticky top-14 z-30 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        {user ? (
          typedPost.profiles?.phone ? (
            <p className="text-sm">
              <span className="text-muted-foreground">Contact parent: </span>
              <a
                href={`tel:${typedPost.profiles.phone}`}
                className="font-medium text-primary underline"
              >
                {typedPost.profiles.phone}
              </a>
            </p>
          ) : (
            <p className="rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Contact flow coming soon. For now, coordinate through your shared
              network or check back when in-app messaging launches.
            </p>
          )
        ) : (
          <ButtonLink href="/signup" className="min-h-11 w-full">
            Sign up to connect with this family
          </ButtonLink>
        )}
      </div>

      {typedPost.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {typedPost.notes}
          </CardContent>
        </Card>
      )}

      {player?.bio && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">About {player.player_name}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {player.bio}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Posted by {typedPost.profiles?.full_name ?? "a parent"}. Coordinate
            session details directly and supervise together.
          </p>
          {!typedPost.profiles?.phone && (
            <p className="rounded-md bg-muted px-3 py-2 text-foreground">
              In-app contact flow coming soon.
            </p>
          )}
        </CardContent>
      </Card>

      <SafetyNotice />

      <p className="text-sm text-muted-foreground">
        <Link href="/availability" className="underline">
          Back to availability
        </Link>
      </p>
    </div>
  );
}
