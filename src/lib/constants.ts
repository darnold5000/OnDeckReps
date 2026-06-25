export const APP_NAME = "OnDeck Reps";
export const APP_TAGLINE =
  "Find live at-bats, bullpen catchers, and throwing partners near you.";

export const LANDING_HEADLINE =
  "Find live at-bats, bullpen catchers, and throwing partners near you";

export const LANDING_SUBHEAD =
  "Post what you need — pitcher, hitter, catcher, location, and time — and connect with travel ball families for game-like reps outside team practice.";

export const LANDING_SUBHEAD_SHORT =
  "Connect with travel ball families for game-like reps near you.";

export const SAMPLE_REQUESTS = [
  {
    title: "Need 11U pitcher for live ABs",
    location: "Plainfield, IN",
    when: "Tomorrow · 6:30 PM",
    chips: ["Pitcher", "11U", "AA", "Live ABs", "$25"],
    note: "AA/AAA hitter · 45 mins",
  },
  {
    title: "13U catcher for bullpen + short live session",
    location: "Carmel, IN",
    when: "Saturday · 11:00 AM",
    chips: ["Catcher", "13U", "Bullpen", "Live ABs"],
    note: "Pitcher throwing 35–40 pitches",
  },
  {
    title: "16U hitter wanted for velo work",
    location: "Westfield, IN",
    when: "Sunday · afternoon",
    chips: ["Hitter", "16U", "HS", "Velo work"],
    note: "High school arm, indoor facility",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Post or browse",
    description:
      "Need a pitcher for live ABs? Post the time, place, age, and level. Or browse what other families need near you.",
  },
  {
    step: "2",
    title: "Match with a family",
    description:
      "Respond to a request or share your player's availability. Parents review responses and pick the right fit.",
  },
  {
    step: "3",
    title: "Run the session together",
    description:
      "Coordinate details directly, show up together, and supervise. Every session stays parent-run.",
  },
] as const;

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
  "Parents coordinate directly and are responsible for supervision, location safety, protective equipment, and deciding whether a session is appropriate. Youth players should never attend sessions without a parent or guardian.";
