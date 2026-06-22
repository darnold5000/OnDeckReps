import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AgeBadge,
  LevelBadge,
  PayBadge,
  RoleBadge,
  StatusBadge,
} from "@/components/status-badges";
import type { AvailabilityPost } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/format";
import { MapPin, Car } from "lucide-react";

export function AvailabilityCard({ post }: { post: AvailabilityPost }) {
  const player = post.player_profiles;

  return (
    <Link href={`/availability/${post.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">
              {player?.player_name ?? "Player"} available
            </CardTitle>
            <StatusBadge status={post.status} />
          </div>
          <CardDescription className="flex flex-wrap gap-1.5 pt-1">
            <RoleBadge role={post.available_role} />
            {player?.age_division && <AgeBadge division={player.age_division} />}
            {player?.team_level && <LevelBadge level={player.team_level} />}
            {post.pay_expectation && (
              <PayBadge payType={post.pay_expectation} />
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            {formatDate(post.session_date)} · {formatTime(post.start_time)}
            {post.end_time && ` – ${formatTime(post.end_time)}`}
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {post.city}, {post.state}
          </p>
          {post.can_travel && post.travel_radius_miles && (
            <p className="flex items-center gap-1">
              <Car className="h-3.5 w-3.5" />
              Will travel up to {post.travel_radius_miles} miles
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
