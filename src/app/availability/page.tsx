import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import { AvailabilityCard } from "@/components/availability-card";
import { AvailabilityFilters } from "@/components/availability-filters";
import type { AvailabilityPost } from "@/lib/types";

export const metadata = { title: "Browse Availability" };

type SearchParams = Promise<{
  division?: string;
  role?: string;
  state?: string;
  date?: string;
}>;

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("availability_posts")
    .select(
      "*, player_profiles(player_name, age_division, team_level), profiles(full_name)"
    )
    .eq("status", "open")
    .order("session_date", { ascending: true });

  if (params.role) query = query.eq("available_role", params.role);
  if (params.state) query = query.eq("state", params.state);
  if (params.date) query = query.eq("session_date", params.date);

  const { data: posts } = await query;

  let filtered = (posts as AvailabilityPost[]) ?? [];
  if (params.division) {
    filtered = filtered.filter(
      (p) => p.player_profiles?.age_division === params.division
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Browse Availability</h1>
          <p className="text-muted-foreground">
            Players available for live reps
          </p>
        </div>
        <ButtonLink href="/availability/new">Post Availability</ButtonLink>
      </div>

      <Suspense fallback={<div className="h-32 animate-pulse rounded-lg bg-muted" />}>
        <AvailabilityFilters />
      </Suspense>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((post) => (
            <AvailabilityCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          No availability posts match your filters.
        </p>
      )}
    </div>
  );
}
