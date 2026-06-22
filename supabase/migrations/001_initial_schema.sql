-- Live Reps MVP schema

-- Profiles (parent/guardian accounts)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  state text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Player profiles
create table public.player_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  player_name text not null,
  birth_year int,
  age_division text not null,
  roles text[] not null default '{}',
  throws text,
  bats text,
  team_level text,
  city text,
  state text,
  travel_radius_miles int,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Rep requests
create table public.rep_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  request_type text not null,
  title text not null,
  description text,
  age_division text not null,
  team_level text,
  role_needed text not null,
  spots_needed int default 1,
  session_date date not null,
  start_time time not null,
  end_time time,
  location_mode text not null,
  location_name text,
  address text,
  city text not null,
  state text not null,
  pay_type text not null,
  pay_amount numeric,
  contact_preference text,
  safety_notes text,
  status text default 'open' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Request responses
create table public.request_responses (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.rep_requests(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  player_profile_id uuid references public.player_profiles(id) on delete set null,
  message text,
  suggested_location text,
  suggested_price numeric,
  status text default 'pending' not null,
  created_at timestamptz default now() not null
);

-- Availability posts
create table public.availability_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  player_profile_id uuid references public.player_profiles(id) on delete cascade not null,
  available_role text not null,
  session_date date not null,
  start_time time not null,
  end_time time,
  city text not null,
  state text not null,
  can_travel boolean default true,
  travel_radius_miles int,
  has_location_access boolean default false,
  location_details text,
  pay_expectation text,
  notes text,
  status text default 'open' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index idx_player_profiles_user_id on public.player_profiles(user_id);
create index idx_rep_requests_user_id on public.rep_requests(user_id);
create index idx_rep_requests_status on public.rep_requests(status);
create index idx_rep_requests_session_date on public.rep_requests(session_date);
create index idx_request_responses_request_id on public.request_responses(request_id);
create index idx_availability_posts_user_id on public.availability_posts(user_id);
create index idx_availability_posts_status on public.availability_posts(status);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger player_profiles_updated_at
  before update on public.player_profiles
  for each row execute function public.handle_updated_at();

create trigger rep_requests_updated_at
  before update on public.rep_requests
  for each row execute function public.handle_updated_at();

create trigger availability_posts_updated_at
  before update on public.availability_posts
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.player_profiles enable row level security;
alter table public.rep_requests enable row level security;
alter table public.request_responses enable row level security;
alter table public.availability_posts enable row level security;

-- Profiles policies
create policy "Authenticated users can read profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Player profiles policies
create policy "Anyone can read player profiles"
  on public.player_profiles for select
  using (true);

create policy "Users can insert own player profiles"
  on public.player_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own player profiles"
  on public.player_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own player profiles"
  on public.player_profiles for delete
  to authenticated
  using (auth.uid() = user_id);

-- Rep requests policies
create policy "Anyone can read open rep requests"
  on public.rep_requests for select
  using (status = 'open' or auth.uid() = user_id);

create policy "Users can insert own rep requests"
  on public.rep_requests for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own rep requests"
  on public.rep_requests for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own rep requests"
  on public.rep_requests for delete
  to authenticated
  using (auth.uid() = user_id);

-- Request responses policies
create policy "Request owners can read responses to their requests"
  on public.request_responses for select
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.rep_requests
      where rep_requests.id = request_responses.request_id
      and rep_requests.user_id = auth.uid()
    )
  );

create policy "Users can insert responses to open requests they do not own"
  on public.request_responses for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.rep_requests
      where rep_requests.id = request_id
      and rep_requests.status = 'open'
      and rep_requests.user_id != auth.uid()
    )
  );

-- Availability posts policies
create policy "Anyone can read open availability posts"
  on public.availability_posts for select
  using (status = 'open' or auth.uid() = user_id);

create policy "Users can insert own availability posts"
  on public.availability_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own availability posts"
  on public.availability_posts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own availability posts"
  on public.availability_posts for delete
  to authenticated
  using (auth.uid() = user_id);
