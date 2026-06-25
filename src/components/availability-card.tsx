import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListingCardFooter } from "@/components/listing-card-footer";
import {
  AgeBadge,
  LevelBadge,
  LocationAccessBadge,
  PayBadge,
  RoleBadge,
  StatusBadge,
} from "@/components/status-badges";
import type { AvailabilityPost } from "@/lib/types";
import { formatDate, formatPayType, formatTime } from "@/lib/format";

export function AvailabilityCard({ post }: { post: AvailabilityPost }) {
  const player = post.player_profiles;
  const title = `${player?.player_name ?? "Player"} — ${post.available_role} available`;
  const location = `${post.city}, ${post.state}`;
  const when = `${formatDate(post.session_date)} · ${formatTime(post.start_time)}${
    post.end_time ? ` – ${formatTime(post.end_time)}` : ""
  }`;
  const pay = post.pay_expectation
    ? formatPayType(post.pay_expectation)
    : "Open";

  return (
    <Link
      href={`/availability/${post.id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="gap-2 pb-2">
          <CardTitle className="text-base leading-snug capitalize">{title}</CardTitle>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>{location}</span>
            <span aria-hidden>·</span>
            <span>{when}</span>
            <span aria-hidden>·</span>
            <span className="font-medium text-foreground">{pay}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-0">
          <div className="flex flex-wrap gap-1">
            <RoleBadge role={post.available_role} />
            {player?.age_division && <AgeBadge division={player.age_division} />}
            {player?.team_level && <LevelBadge level={player.team_level} />}
            <LocationAccessBadge hasAccess={post.has_location_access} />
            {post.pay_expectation && (
              <PayBadge payType={post.pay_expectation} />
            )}
            <StatusBadge status={post.status} />
          </div>
          {post.can_travel && post.travel_radius_miles && (
            <p className="text-xs text-muted-foreground">
              Will travel up to {post.travel_radius_miles} miles
            </p>
          )}
          {post.notes && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{post.notes}</p>
          )}
          <ListingCardFooter />
        </CardContent>
      </Card>
    </Link>
  );
}
