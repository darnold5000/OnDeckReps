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
  SessionTypeBadge,
  StatusBadge,
} from "@/components/status-badges";
import type { RepRequest } from "@/lib/types";
import { formatDate, formatSessionType, formatTime } from "@/lib/format";
import { Calendar, MapPin, Users } from "lucide-react";

export function RequestCard({ request }: { request: RepRequest }) {
  const sessionType = formatSessionType(request.request_type);

  return (
    <Link href={`/requests/${request.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{request.title}</CardTitle>
            <StatusBadge status={request.status} />
          </div>
          <CardDescription className="flex flex-wrap gap-1.5 pt-1">
            <RoleBadge role={request.role_needed} />
            <AgeBadge division={request.age_division} />
            <LevelBadge level={request.team_level} />
            <SessionTypeBadge label={sessionType} />
            <PayBadge payType={request.pay_type} amount={request.pay_amount} />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {request.description && (
            <p className="line-clamp-2 text-muted-foreground">{request.description}</p>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              {formatDate(request.session_date)} · {formatTime(request.start_time)}
              {request.end_time && ` – ${formatTime(request.end_time)}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>
              {request.location_name ? `${request.location_name}, ` : ""}
              {request.city}, {request.state}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>
              {request.spots_needed} spot{request.spots_needed !== 1 ? "s" : ""} needed
            </span>
          </div>
          {request.profiles?.full_name && (
            <p className="text-xs text-muted-foreground">
              Posted by {request.profiles.full_name}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
