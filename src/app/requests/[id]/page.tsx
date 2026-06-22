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
import { Separator } from "@/components/ui/separator";
import {
  AgeBadge,
  LevelBadge,
  PayBadge,
  RoleBadge,
  StatusBadge,
} from "@/components/status-badges";
import { SafetyNotice } from "@/components/safety-notice";
import { InterestForm } from "@/components/interest-form";
import { RequestActions } from "@/components/request-actions";
import type { RepRequest, RequestResponse, PlayerProfile } from "@/lib/types";
import {
  formatDate,
  formatTime,
  formatLocationMode,
  formatRequestType,
} from "@/lib/format";
import { MapPin, Users, Calendar, Clock } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("rep_requests")
    .select("title")
    .eq("id", id)
    .single();
  return { title: data?.title ?? "Request" };
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: request } = await supabase
    .from("rep_requests")
    .select("*, profiles(full_name, phone)")
    .eq("id", id)
    .single();

  if (!request) notFound();

  const typedRequest = request as RepRequest & {
    profiles: { full_name: string | null; phone: string | null };
  };

  const isOwner = user?.id === typedRequest.user_id;

  let responses: RequestResponse[] = [];
  let myPlayers: PlayerProfile[] = [];

  if (isOwner) {
    const { data } = await supabase
      .from("request_responses")
      .select(
        "*, profiles(full_name, phone), player_profiles(player_name, age_division)"
      )
      .eq("request_id", id)
      .order("created_at", { ascending: false });
    responses = (data as RequestResponse[]) ?? [];
  } else if (user) {
    const { data } = await supabase
      .from("player_profiles")
      .select("*")
      .eq("user_id", user.id);
    myPlayers = (data as PlayerProfile[]) ?? [];
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-2xl font-bold">{typedRequest.title}</h1>
          <StatusBadge status={typedRequest.status} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <RoleBadge role={typedRequest.role_needed} />
          <AgeBadge division={typedRequest.age_division} />
          <LevelBadge level={typedRequest.team_level} />
          <PayBadge
            payType={typedRequest.pay_type}
            amount={typedRequest.pay_amount}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatRequestType(typedRequest.request_type)} · Posted by{" "}
          {typedRequest.profiles?.full_name ?? "Parent"}
        </p>
      </div>

      <SafetyNotice />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {typedRequest.description && (
            <p className="text-muted-foreground">{typedRequest.description}</p>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {formatDate(typedRequest.session_date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {formatTime(typedRequest.start_time)}
            {typedRequest.end_time && ` – ${formatTime(typedRequest.end_time)}`}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {typedRequest.location_name && `${typedRequest.location_name}, `}
            {typedRequest.city}, {typedRequest.state}
            {typedRequest.address && ` (${typedRequest.address})`}
          </div>
          <p className="text-muted-foreground">
            Location: {formatLocationMode(typedRequest.location_mode)}
          </p>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {typedRequest.spots_needed} spot
            {typedRequest.spots_needed !== 1 ? "s" : ""} needed
          </div>
          {typedRequest.safety_notes && (
            <p className="rounded-md bg-muted p-3">
              <strong>Safety notes:</strong> {typedRequest.safety_notes}
            </p>
          )}
        </CardContent>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Interested responses ({responses.length})
              </CardTitle>
              <RequestActions
                requestId={typedRequest.id}
                status={typedRequest.status}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {responses.length ? (
              responses.map((response) => (
                <div key={response.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {response.profiles?.full_name ?? "Parent"}
                    </p>
                    <StatusBadge status={response.status} />
                  </div>
                  {response.player_profiles && (
                    <p className="text-sm text-muted-foreground">
                      Player: {response.player_profiles.player_name} (
                      {response.player_profiles.age_division})
                    </p>
                  )}
                  {response.message && <p className="text-sm">{response.message}</p>}
                  {response.suggested_location && (
                    <p className="text-sm text-muted-foreground">
                      Suggested location: {response.suggested_location}
                    </p>
                  )}
                  {response.suggested_price != null && (
                    <p className="text-sm text-muted-foreground">
                      Suggested price: ${response.suggested_price}
                    </p>
                  )}
                  {response.profiles?.phone && (
                    <p className="text-sm">Phone: {response.profiles.phone}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No responses yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!isOwner && typedRequest.status === "open" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">I&apos;m interested</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <InterestForm requestId={typedRequest.id} players={myPlayers} />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Log in to respond to this request.
                </p>
                <ButtonLink href="/login">Log in</ButtonLink>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      <p className="text-sm text-muted-foreground">
        <Link href="/requests" className="underline">
          Back to requests
        </Link>
      </p>
    </div>
  );
}
