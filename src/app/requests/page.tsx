import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Browse Requests</h1>
          <p className="text-muted-foreground">
            Find live rep opportunities near you
          </p>
        </div>
        <ButtonLink href="/requests/new">Create Request</ButtonLink>
      </div>

      <Suspense fallback={<div className="h-32 animate-pulse rounded-lg bg-muted" />}>
        <RequestFilters />
      </Suspense>

      {(requests as RepRequest[])?.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {(requests as RepRequest[]).map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          No open requests match your filters.
        </p>
      )}
    </div>
  );
}
