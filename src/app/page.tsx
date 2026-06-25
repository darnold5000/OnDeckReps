import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import { RequestCard } from "@/components/request-card";
import { SampleRequestCard } from "@/components/sample-request-card";
import { PathCard } from "@/components/path-card";
import { EmptyState } from "@/components/empty-state";
import { SafetyNotice } from "@/components/safety-notice";
import {
  APP_NAME,
  HOW_IT_WORKS_STEPS,
  LANDING_HEADLINE,
  LANDING_SUBHEAD,
  LANDING_SUBHEAD_SHORT,
  SAMPLE_REQUESTS,
} from "@/lib/constants";
import { CalendarPlus, Users } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: liveRequests } = await supabase
    .from("rep_requests")
    .select("*, profiles(full_name)")
    .eq("status", "open")
    .order("session_date", { ascending: true })
    .limit(3);

  return (
    <div className="flex flex-col gap-10 py-2 md:gap-12 md:py-6">
      {/* Hero — compact on mobile */}
      <section className="mx-auto max-w-3xl space-y-4 text-center md:space-y-5">
        <p className="text-3xl md:text-5xl" aria-hidden>
          ⚾
        </p>
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {APP_NAME}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
          {LANDING_HEADLINE}
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:hidden">
          {LANDING_SUBHEAD_SHORT}
        </p>
        <p className="mx-auto hidden max-w-2xl text-base text-muted-foreground sm:block md:text-lg">
          {LANDING_SUBHEAD}
        </p>
        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-center sm:gap-3">
          <ButtonLink href="/requests/new" size="lg" className="min-h-11 w-full sm:w-auto">
            Post a Request
          </ButtonLink>
          <ButtonLink
            href="/requests"
            size="lg"
            variant="outline"
            className="min-h-11 w-full sm:w-auto"
          >
            Browse Reps Near Me
          </ButtonLink>
        </div>
      </section>

      {/* Two paths */}
      <section className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <PathCard
          variant="primary"
          title="Need a pitcher, hitter, or catcher?"
          description="Post the time, place, age, and level. Nearby families can respond with their player."
          ctaLabel="Post a Request"
          href="/requests/new"
          icon={CalendarPlus}
        />
        <PathCard
          title="Want to offer availability?"
          description="List open times for pitching, hitting, or catching so other families can book reps."
          ctaLabel="Share Availability"
          href="/availability/new"
          icon={Users}
        />
      </section>

      {/* Sample requests */}
      <section className="space-y-3 md:space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold md:text-2xl">See what families are posting</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Examples of live ABs, bullpens, and catcher needs
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {SAMPLE_REQUESTS.map((request) => (
            <SampleRequestCard key={request.title} request={request} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 space-y-4 md:space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold md:text-2xl">How it works</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            From post to session in three steps
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div key={item.step} className="rounded-lg border bg-card p-4 md:p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {item.step}
              </span>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section className="space-y-3">
        <h2 className="text-center text-xl font-bold md:text-2xl">Keep it parent-run</h2>
        <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
          Parents coordinate directly, approve the match, and supervise sessions. No
          drop-offs, no mystery.
        </p>
        <SafetyNotice />
      </section>

      {/* Live requests */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Browse current requests</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Open rep needs from families near you
            </p>
          </div>
          <ButtonLink href="/requests" variant="outline" className="min-h-11 w-full sm:w-auto">
            View all requests
          </ButtonLink>
        </div>
        {liveRequests && liveRequests.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {liveRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No open requests yet"
            description="Be the first family to post a live AB, bullpen, or catcher need in your area."
            actionLabel="Post a Request"
            actionHref="/requests/new"
          />
        )}
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Coming soon: payments, background checks, and in-app messaging.
      </p>
    </div>
  );
}
