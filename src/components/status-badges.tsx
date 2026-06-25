import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const roleColors: Record<string, string> = {
  pitcher: "bg-blue-100 text-blue-800 border-blue-200",
  hitter: "bg-green-100 text-green-800 border-green-200",
  catcher: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusColors: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-800 border-emerald-200",
  filled: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const payColors: Record<string, string> = {
  paid: "bg-purple-100 text-purple-800 border-purple-200",
  free: "bg-teal-100 text-teal-800 border-teal-200",
  trade: "bg-indigo-100 text-indigo-800 border-indigo-200",
  decide: "bg-slate-100 text-slate-800 border-slate-200",
};

export function RoleBadge({ role }: { role: string }) {
  return (
        <Badge
      variant="outline"
      className={cn("capitalize text-xs", roleColors[role] ?? "")}
    >
      {role}
    </Badge>
  );
}

export function AgeBadge({ division }: { division: string }) {
  return (
    <Badge variant="outline" className="bg-sky-100 text-sky-800 border-sky-200 text-xs">
      {division}
    </Badge>
  );
}

export function LevelBadge({ level }: { level: string | null }) {
  if (!level) return null;
  const display =
    level === "high school"
      ? "HS"
      : level === "all-star"
        ? "All-Star"
        : level === "rec"
          ? "Rec"
          : level.toUpperCase();
  return (
    <Badge variant="outline" className="bg-stone-100 text-stone-800 border-stone-200 text-xs">
      {display}
    </Badge>
  );
}

export function PayBadge({
  payType,
  amount,
}: {
  payType: string;
  amount?: number | null;
}) {
  const label =
    payType === "paid"
      ? amount
        ? `$${amount}`
        : "Paid"
      : payType === "free"
        ? "Free"
        : payType === "trade"
          ? "Trade reps"
          : "Decide together";

  return (
    <Badge
      variant="outline"
      className={cn("text-xs", payColors[payType] ?? "")}
    >
      {label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize text-xs", statusColors[status] ?? "")}
    >
      {status}
    </Badge>
  );
}

const sessionColors: Record<string, string> = {
  "Live ABs": "bg-amber-100 text-amber-900 border-amber-200",
  "Hitting reps": "bg-lime-100 text-lime-900 border-lime-200",
  Bullpen: "bg-violet-100 text-violet-900 border-violet-200",
  "Small group": "bg-rose-100 text-rose-900 border-rose-200",
};

export function SessionTypeBadge({ label }: { label: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs", sessionColors[label] ?? "bg-muted text-muted-foreground")}
    >
      {label}
    </Badge>
  );
}

export function ChipBadge({ label }: { label: string }) {
  return (
    <Badge
      variant="outline"
      className="shrink-0 whitespace-nowrap bg-muted/60 text-foreground text-xs"
    >
      {label}
    </Badge>
  );
}

export function LocationAccessBadge({ hasAccess }: { hasAccess: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        hasAccess
          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
          : "bg-muted text-muted-foreground"
      )}
    >
      {hasAccess ? "Has field access" : "No field access"}
    </Badge>
  );
}
