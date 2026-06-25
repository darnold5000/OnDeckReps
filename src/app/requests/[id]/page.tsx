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
import { EmptyState } from "@/components/empty-state";
import {
  AgeBadge,
  LevelBadge,
  PayBadge,
  RoleBadge,
  SessionTypeBadge,
  StatusBadge,
} from "@/components/status-badges";
import { SafetyNotice } from "@/components/safety-notice";
import { InterestForm } from "@/components/interest-form";
import { RequestActions } from "@/components/request-actions";
import type { RepRequest, RequestResponse, PlayerProfile } from "@/lib/types";
import {
  formatDate,
  formatLocationMode,
  formatRequestType,
  formatSessionType,
  formatTime,
} from "@/lib/format";

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
  const sessionType = formatSessionType(typedRequest.request_type);
  const locationLine = [
    typedRequest.location_name,
    typedRequest.city,
    typedRequest.state,
    typedRequest.address ? `(${typedRequest.address})` : null,
  ]
    .filter(Boolean)
    .join(", ");

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

  const showInterest = !isOwner && typedRequest.status === "open";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <DetailSummary
        title={typedRequest.title}
        badge={<StatusBadge status={typedRequest.status} />}
        chips={
          <>
            <RoleBadge role={typedRequest.role_needed} />
            <AgeBadge division={typedRequest.age_division} />
            <LevelBadge level={typedRequest.team_level} />
            <SessionTypeBadge label={sessionType} />
            <PayBadge
              payType={typedRequest.pay_type}
              amount={typedRequest.pay_amount}
            />
          </>
        }
        rows={[
          {
            label: "Date",
            value: formatDate(typedRequest.session_date),
          },
          {
            label: "Time",
            value: `${formatTime(typedRequest.start_time)}${
              typedRequest.end_time ? ` – ${formatTime(typedRequest.end_time)}` : ""
            }`,
          },
          {
            label: "Location",
            value: locationLine,
          },
          {
            label: "Spots",
            value: `${typedRequest.spots_needed} needed`,
          },
          {
            label: "Posted by",
            value: typedRequest.profiles?.full_name ?? "Parent",
          },
          {
            label: "Type",
            value: formatRequestType(typedRequest.request_type),
          },
        ]}
      />

      {/* Primary CTA — sticky on mobile */}
      <div className="sticky top-14 z-30 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        {isOwner && typedRequest.status === "open" && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href={`#responses`} className="min-h-11 w-full sm:w-auto">
              View responses ({responses.length})
            </ButtonLink>
            <RequestActions
              requestId={typedRequest.id}
              status={typedRequest.status}
            />
          </div>
        )}
        {showInterest && (
          <div className="space-y-2">
            {user ? (
              myPlayers.length > 0 ? (
                <ButtonLink href="#respond" className="min-h-11 w-full">
                  I&apos;m interested
                </ButtonLink>
              ) : (
                <ButtonLink href="/players/new" className="min-h-11 w-full">
                  Add a player to respond
                </ButtonLink>
              )
            ) : (
              <ButtonLink href="/signup" className="min-h-11 w-full">
                Sign up to respond
              </ButtonLink>
            )}
          </div>
        )}
      </div>

      {typedRequest.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">About this session</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {typedRequest.description}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Session details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Location plan: {formatLocationMode(typedRequest.location_mode)}</p>
          {typedRequest.safety_notes && (
            <p className="rounded-md bg-muted p-3 text-foreground">
              <strong className="font-medium">Session notes:</strong>{" "}
              {typedRequest.safety_notes}
            </p>
          )}
        </CardContent>
      </Card>

      <SafetyNotice />

      {isOwner && (
        <Card id="responses">
          <CardHeader>
            <CardTitle className="text-lg">
              Interested families ({responses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {responses.length ? (
              responses.map((response) => (
                <div key={response.id} className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-2">
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
              <EmptyState
                title="No responses yet"
                description="When families respond, you'll see their player, message, and contact info here."
                actionLabel="Browse other requests"
                actionHref="/requests"
                actionVariant="outline"
              />
            )}
          </CardContent>
        </Card>
      )}

      {showInterest && (
        <Card id="respond">
          <CardHeader>
            <CardTitle className="text-lg">Respond to this request</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <InterestForm requestId={typedRequest.id} players={myPlayers} />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Create a free account to tell this family about your player.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <ButtonLink href="/signup" className="min-h-11 w-full sm:w-auto">
                    Sign up to respond
                  </ButtonLink>
                  <ButtonLink
                    href="/login"
                    variant="outline"
                    className="min-h-11 w-full sm:w-auto"
                  >
                    Log in
                  </ButtonLink>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground">
        <Link href="/requests" className="underline">
          Back to requests
        </Link>
      </p>
    </div>
  );
}
