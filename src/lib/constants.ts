export const APP_NAME = "Live Reps";
export const APP_TAGLINE =
  "Find pitchers, hitters, and catchers for real baseball reps.";

export const AGE_DIVISIONS = [
  "9U",
  "10U",
  "11U",
  "12U",
  "13U",
  "14U",
  "15U",
  "16U",
  "17U",
  "18U",
] as const;

export const ROLES = ["pitcher", "hitter", "catcher"] as const;

export const THROWS_OPTIONS = ["right", "left", "unknown"] as const;
export const BATS_OPTIONS = ["right", "left", "switch", "unknown"] as const;

export const TEAM_LEVELS = [
  "rec",
  "all-star",
  "A",
  "AA",
  "AAA",
  "Majors",
  "high school",
  "unknown",
] as const;

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

export const REQUEST_TYPES = [
  { value: "need_pitcher", label: "Need pitcher" },
  { value: "need_hitter", label: "Need hitter" },
  { value: "need_catcher", label: "Need catcher" },
  { value: "need_group_session", label: "Need group session" },
] as const;

export const LOCATION_MODES = [
  { value: "provide", label: "I will provide location" },
  { value: "provider_suggest", label: "Provider can suggest location" },
  { value: "flexible", label: "Flexible / decide together" },
] as const;

export const PAY_TYPES = [
  { value: "paid", label: "Paid" },
  { value: "free", label: "Free" },
  { value: "trade", label: "Trade reps" },
  { value: "decide", label: "Decide together" },
] as const;

export const CONTACT_PREFERENCES = [
  { value: "in_app", label: "In-app response" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
] as const;

export const REQUEST_STATUSES = ["open", "filled", "cancelled"] as const;

export const SAFETY_NOTICE =
  "Live Reps helps families connect. Parents/guardians are responsible for supervision, location safety, protective equipment, and deciding whether a session is appropriate. Youth players should never attend sessions without a parent/guardian.";
