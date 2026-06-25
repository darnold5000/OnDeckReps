import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import { EmptyState } from "@/components/empty-state";
import { RequestCard } from "@/components/request-card";
import { RequestFilters } from "@/components/request-filters";
import type { RepRequest } from "@/lib/types";

export const metadata = { title: "Browse Requests" };

type SearchParams = Promise<{
  division?: string;
  role?: string;
  level?: string;
  state?: string;
  city?: string;
  date?: string;
}>;

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("rep_requests")
    .select("*, profiles(full_name)")
    .eq("status", "open")
    .order("session_date", { ascending: true });

  if (params.division) query = query.eq("age_division", params.division);
  if (params.role) query = query.eq("role_needed", params.role);
  if (params.level) query = query.eq("team_level", params.level);
  if (params.state) query = query.eq("state", params.state);
  if (params.city) query = query.ilike("city", `%${params.city}%`);
  if (params.date) query = query.eq("session_date", params.date);

  const { data: requests } = await query;
  const hasFilters = Object.keys(params).length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Browse Requests</h1>
          <p className="text-sm text-muted-foreground">
            Live ABs, bullpens, and catcher needs near you
          </p>
        </div>
        <ButtonLink href="/requests/new" className="min-h-11 w-full sm:w-auto">
          Post a Request
        </ButtonLink>
      </div>

      <Suspense fallback={<div className="h-32 animate-pulse rounded-lg bg-muted" />}>
        <RequestFilters />
      </Suspense>

      {(requests as RepRequest[])?.length ? (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {(requests as RepRequest[]).map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            hasFilters
              ? "No requests match your filters"
              : "No open requests yet"
          }
          description={
            hasFilters
              ? "Try widening your search or clear filters to see more rep needs."
              : "Be the first family to post a live AB, bullpen, or catcher need in your area."
          }
          actionLabel={hasFilters ? "Clear filters" : "Post a Request"}
          actionHref={hasFilters ? "/requests" : "/requests/new"}
          actionVariant={hasFilters ? "outline" : "default"}
        />
      )}
    </div>
  );
}
