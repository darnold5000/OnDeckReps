-- Live Reps seed data for development/demo
-- Run after creating at least one auth user, or use with service role to insert demo data.
--
-- For local dev with Supabase:
-- 1. Create a test user via signup in the app
-- 2. Replace USER_ID below with that user's UUID
-- 3. Run this script in the Supabase SQL editor

-- Example: set your user id
-- \set user_id '00000000-0000-0000-0000-000000000001'

-- Demo seed (requires existing user_id — update before running)
/*
INSERT INTO public.profiles (id, full_name, phone, city, state)
VALUES (
  'YOUR_USER_ID_HERE',
  'Demo Parent',
  '555-0100',
  'Indianapolis',
  'IN'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  city = EXCLUDED.city,
  state = EXCLUDED.state;

INSERT INTO public.player_profiles (user_id, player_name, birth_year, age_division, roles, throws, bats, team_level, city, state, travel_radius_miles, bio)
VALUES
  ('YOUR_USER_ID_HERE', 'Jake Miller', 2014, '10U', ARRAY['pitcher'], 'right', 'right', 'AA', 'Plainfield', 'IN', 20, 'Competitive 10U pitcher, throws mid-60s.'),
  ('YOUR_USER_ID_HERE', 'Tyler Brooks', 2013, '11U', ARRAY['hitter'], 'right', 'left', 'AA', 'Avon', 'IN', 15, 'Left-handed contact hitter.'),
  ('YOUR_USER_ID_HERE', 'Mason Reed', 2012, '12U', ARRAY['catcher'], 'right', 'right', 'AA', 'Mooresville', 'IN', 10, 'Reliable catcher with gear.'),
  ('YOUR_USER_ID_HERE', 'Ethan Carter', 2011, '13U', ARRAY['pitcher'], 'right', 'right', 'AA', 'Brownsburg', 'IN', 15, '13U pitcher available for live reps.');

INSERT INTO public.rep_requests (user_id, request_type, title, description, age_division, team_level, role_needed, spots_needed, session_date, start_time, end_time, location_mode, location_name, address, city, state, pay_type, pay_amount, contact_preference, status)
VALUES
  ('YOUR_USER_ID_HERE', 'need_pitcher', 'Need 10U AA pitcher for live ABs', 'Looking for a 10U AA pitcher to throw live at-bats for our hitter. Field available.', '10U', 'AA', 'pitcher', 1, CURRENT_DATE + 7, '17:00', '19:00', 'provide', 'Plainfield Youth Sports Complex', '651 S Perry Road', 'Plainfield', 'IN', 'trade', NULL, 'in_app', 'open'),
  ('YOUR_USER_ID_HERE', 'need_hitter', 'Need 3 hitters for 11U bullpen work', 'Our pitcher needs live AB reps. Need 3 hitters around 11U AA level.', '11U', 'AA', 'hitter', 3, CURRENT_DATE + 10, '18:00', '20:00', 'provide', 'Avon Little League Fields', '1000 E Main St', 'Avon', 'IN', 'free', NULL, 'phone', 'open'),
  ('YOUR_USER_ID_HERE', 'need_catcher', 'Need catcher for 12U pitching session', 'Pitcher bullpen session, need a catcher with gear for 12U level.', '12U', 'AA', 'catcher', 1, CURRENT_DATE + 14, '16:30', '18:30', 'flexible', NULL, 'Near Mooresville', 'Mooresville', 'IN', 'decide', NULL, 'in_app', 'open');

INSERT INTO public.availability_posts (user_id, player_profile_id, available_role, session_date, start_time, end_time, city, state, can_travel, travel_radius_miles, has_location_access, pay_expectation, notes, status)
SELECT
  'YOUR_USER_ID_HERE',
  id,
  'pitcher',
  CURRENT_DATE + 5,
  '17:00',
  '20:00',
  'Brownsburg',
  'IN',
  true,
  15,
  false,
  'trade',
  '13U pitcher available for live reps within 15 miles.',
  'open'
FROM public.player_profiles
WHERE player_name = 'Ethan Carter'
LIMIT 1;
*/

-- Standalone demo data using a function (run once with service role)
-- Creates demo requests without a real user for read-only browsing tests
-- Note: These won't have valid user_id FK unless you disable FK or use real users.

CREATE OR REPLACE FUNCTION public.seed_demo_data(demo_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  player_10u uuid;
  player_11u uuid;
  player_12u uuid;
  player_13u uuid;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, city, state)
  VALUES (demo_user_id, 'Demo Parent', '555-0100', 'Indianapolis', 'IN')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    city = EXCLUDED.city,
    state = EXCLUDED.state;

  INSERT INTO public.player_profiles (user_id, player_name, birth_year, age_division, roles, throws, bats, team_level, city, state, travel_radius_miles, bio)
  VALUES (demo_user_id, 'Jake Miller', 2014, '10U', ARRAY['pitcher'], 'right', 'right', 'AA', 'Plainfield', 'IN', 20, 'Competitive 10U pitcher.')
  RETURNING id INTO player_10u;

  INSERT INTO public.player_profiles (user_id, player_name, birth_year, age_division, roles, throws, bats, team_level, city, state, travel_radius_miles, bio)
  VALUES (demo_user_id, 'Tyler Brooks', 2013, '11U', ARRAY['hitter'], 'right', 'left', 'AA', 'Avon', 'IN', 15, 'Left-handed contact hitter.')
  RETURNING id INTO player_11u;

  INSERT INTO public.player_profiles (user_id, player_name, birth_year, age_division, roles, throws, bats, team_level, city, state, travel_radius_miles, bio)
  VALUES (demo_user_id, 'Mason Reed', 2012, '12U', ARRAY['catcher'], 'right', 'right', 'AA', 'Mooresville', 'IN', 10, 'Reliable catcher with gear.')
  RETURNING id INTO player_12u;

  INSERT INTO public.player_profiles (user_id, player_name, birth_year, age_division, roles, throws, bats, team_level, city, state, travel_radius_miles, bio)
  VALUES (demo_user_id, 'Ethan Carter', 2011, '13U', ARRAY['pitcher'], 'right', 'right', 'AA', 'Brownsburg', 'IN', 15, '13U pitcher available for live reps.')
  RETURNING id INTO player_13u;

  INSERT INTO public.rep_requests (user_id, request_type, title, description, age_division, team_level, role_needed, spots_needed, session_date, start_time, end_time, location_mode, location_name, address, city, state, pay_type, contact_preference, status)
  VALUES
    (demo_user_id, 'need_pitcher', 'Need 10U AA pitcher for live ABs', 'Looking for a 10U AA pitcher to throw live at-bats.', '10U', 'AA', 'pitcher', 1, CURRENT_DATE + 7, '17:00', '19:00', 'provide', 'Plainfield Youth Sports Complex', '651 S Perry Road', 'Plainfield', 'IN', 'trade', 'in_app', 'open'),
    (demo_user_id, 'need_hitter', 'Need 3 hitters for 11U bullpen work', 'Our pitcher needs live AB reps. Need 3 hitters around 11U AA.', '11U', 'AA', 'hitter', 3, CURRENT_DATE + 10, '18:00', '20:00', 'provide', 'Avon Little League Fields', '1000 E Main St', 'Avon', 'IN', 'free', 'phone', 'open'),
    (demo_user_id, 'need_catcher', 'Need catcher for 12U pitching session', 'Pitcher bullpen session, need a catcher with gear.', '12U', 'AA', 'catcher', 1, CURRENT_DATE + 14, '16:30', '18:30', 'flexible', NULL, 'Near Mooresville', 'Mooresville', 'IN', 'decide', 'in_app', 'open');

  INSERT INTO public.availability_posts (user_id, player_profile_id, available_role, session_date, start_time, end_time, city, state, can_travel, travel_radius_miles, pay_expectation, notes, status)
  VALUES (demo_user_id, player_13u, 'pitcher', CURRENT_DATE + 5, '17:00', '20:00', 'Brownsburg', 'IN', true, 15, 'trade', '13U pitcher available for live reps within 15 miles.', 'open');
END;
$$;
