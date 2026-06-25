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
  RoleBadge,
  SessionTypeBadge,
  StatusBadge,
} from "@/components/status-badges";
import type { RepRequest } from "@/lib/types";
import {
  formatDate,
  formatPayType,
  formatSessionType,
  formatTime,
} from "@/lib/format";

export function RequestCard({ request }: { request: RepRequest }) {
  const sessionType = formatSessionType(request.request_type);
  const location = request.location_name
    ? `${request.location_name}, ${request.city}, ${request.state}`
    : `${request.city}, ${request.state}`;
  const when = `${formatDate(request.session_date)} · ${formatTime(request.start_time)}${
    request.end_time ? ` – ${formatTime(request.end_time)}` : ""
  }`;
  const pay = formatPayType(request.pay_type, request.pay_amount);

  return (
    <Link
      href={`/requests/${request.id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="gap-2 pb-2">
          <CardTitle className="text-base leading-snug">{request.title}</CardTitle>
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
            <RoleBadge role={request.role_needed} />
            <AgeBadge division={request.age_division} />
            <LevelBadge level={request.team_level} />
            <SessionTypeBadge label={sessionType} />
            <StatusBadge status={request.status} />
          </div>
          {request.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {request.description}
            </p>
          )}
          <ListingCardFooter />
        </CardContent>
      </Card>
    </Link>
  );
}
