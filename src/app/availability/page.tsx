import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import { EmptyState } from "@/components/empty-state";
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

  const hasFilters = Object.keys(params).length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Browse Availability</h1>
          <p className="text-sm text-muted-foreground">
            Players open for pitching, hitting, and catching reps
          </p>
        </div>
        <ButtonLink href="/availability/new" className="min-h-11 w-full sm:w-auto">
          Share Availability
        </ButtonLink>
      </div>

      <Suspense fallback={<div className="h-32 animate-pulse rounded-lg bg-muted" />}>
        <AvailabilityFilters />
      </Suspense>

      {filtered.length ? (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {filtered.map((post) => (
            <AvailabilityCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            hasFilters
              ? "No availability matches your filters"
              : "No availability posted yet"
          }
          description={
            hasFilters
              ? "Try adjusting your filters or check back as more families post open times."
              : "Be the first to share when your player is free for extra reps."
          }
          actionLabel={hasFilters ? "Clear filters" : "Share Availability"}
          actionHref={hasFilters ? "/availability" : "/availability/new"}
          actionVariant={hasFilters ? "outline" : "default"}
        />
      )}
    </div>
  );
}
