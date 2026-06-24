import { format, parse } from "date-fns";

export function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr + "T00:00:00"), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr: string): string {
  try {
    const parsed = parse(timeStr.slice(0, 5), "HH:mm", new Date());
    return format(parsed, "h:mm a");
  } catch {
    return timeStr;
  }
}

export function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function formatPayType(payType: string, amount?: number | null): string {
  switch (payType) {
    case "paid":
      return amount ? `$${amount}` : "Paid";
    case "free":
      return "Free";
    case "trade":
      return "Trade reps";
    case "decide":
      return "Decide together";
    default:
      return payType;
  }
}

export function formatTeamLevel(level: string | null): string {
  if (!level) return "";
  if (level === "high school") return "High School";
  if (level === "all-star") return "All-Star";
  if (level === "rec") return "Rec";
  return level.toUpperCase();
}

export function formatLocationMode(mode: string): string {
  switch (mode) {
    case "provide":
      return "Location provided";
    case "provider_suggest":
      return "Provider can suggest";
    case "flexible":
      return "Flexible";
    default:
      return mode;
  }
}

export function formatRequestType(type: string): string {
  switch (type) {
    case "need_pitcher":
      return "Need pitcher";
    case "need_hitter":
      return "Need hitter";
    case "need_catcher":
      return "Need catcher";
    case "need_group_session":
      return "Group session";
    default:
      return type;
  }
}

export function formatSessionType(requestType: string): string {
  switch (requestType) {
    case "need_pitcher":
      return "Live ABs";
    case "need_hitter":
      return "Hitting reps";
    case "need_catcher":
      return "Bullpen";
    case "need_group_session":
      return "Small group";
    default:
      return "Session";
  }
}
