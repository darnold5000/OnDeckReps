export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
  updated_at: string;
};

export type PlayerProfile = {
  id: string;
  user_id: string;
  player_name: string;
  birth_year: number | null;
  age_division: string;
  roles: string[];
  throws: string | null;
  bats: string | null;
  team_level: string | null;
  city: string | null;
  state: string | null;
  travel_radius_miles: number | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type RepRequest = {
  id: string;
  user_id: string;
  request_type: string;
  title: string;
  description: string | null;
  age_division: string;
  team_level: string | null;
  role_needed: string;
  spots_needed: number;
  session_date: string;
  start_time: string;
  end_time: string | null;
  location_mode: string;
  location_name: string | null;
  address: string | null;
  city: string;
  state: string;
  pay_type: string;
  pay_amount: number | null;
  contact_preference: string | null;
  safety_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "full_name"> | null;
};

export type RequestResponse = {
  id: string;
  request_id: string;
  user_id: string;
  player_profile_id: string | null;
  message: string | null;
  suggested_location: string | null;
  suggested_price: number | null;
  status: string;
  created_at: string;
  profiles?: Pick<Profile, "full_name" | "phone"> | null;
  player_profiles?: Pick<PlayerProfile, "player_name" | "age_division"> | null;
};

export type AvailabilityPost = {
  id: string;
  user_id: string;
  player_profile_id: string;
  available_role: string;
  session_date: string;
  start_time: string;
  end_time: string | null;
  city: string;
  state: string;
  can_travel: boolean;
  travel_radius_miles: number | null;
  has_location_access: boolean;
  location_details: string | null;
  pay_expectation: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  player_profiles?: Pick<
    PlayerProfile,
    "player_name" | "age_division" | "team_level"
  > | null;
  profiles?: Pick<Profile, "full_name"> | null;
};
