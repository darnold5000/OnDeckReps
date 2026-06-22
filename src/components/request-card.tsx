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
import type { RepRequest } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/format";
import { MapPin, Users } from "lucide-react";

export function RequestCard({ request }: { request: RepRequest }) {
  return (
    <Link href={`/requests/${request.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{request.title}</CardTitle>
            <StatusBadge status={request.status} />
          </div>
          <CardDescription className="flex flex-wrap gap-1.5 pt-1">
            <RoleBadge role={request.role_needed} />
            <AgeBadge division={request.age_division} />
            <LevelBadge level={request.team_level} />
            <PayBadge payType={request.pay_type} amount={request.pay_amount} />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            {formatDate(request.session_date)} · {formatTime(request.start_time)}
            {request.end_time && ` – ${formatTime(request.end_time)}`}
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {request.city}, {request.state}
          </p>
          <p className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {request.spots_needed} spot{request.spots_needed !== 1 ? "s" : ""} needed
          </p>
          {request.profiles?.full_name && (
            <p className="text-xs">Posted by {request.profiles.full_name}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
