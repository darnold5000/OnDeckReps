import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import { RequestCard } from "@/components/request-card";
import { SampleRequestCard } from "@/components/sample-request-card";
import { SafetyNotice } from "@/components/safety-notice";
import {
  APP_NAME,
  HOW_IT_WORKS_STEPS,
  LANDING_HEADLINE,
  LANDING_SUBHEAD,
  SAMPLE_REQUESTS,
} from "@/lib/constants";
import { ArrowRight, CalendarPlus, Users } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: liveRequests } = await supabase
    .from("rep_requests")
    .select("*, profiles(full_name)")
    .eq("status", "open")
    .order("session_date", { ascending: true })
    .limit(3);

  return (
    <div className="flex flex-col gap-16 py-4 md:py-8">
      {/* Hero */}
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <p className="text-5xl">⚾</p>
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          {APP_NAME}
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {LANDING_HEADLINE}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {LANDING_SUBHEAD}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <ButtonLink href="/requests/new" size="lg">
            Post a Request
          </ButtonLink>
          <ButtonLink href="/requests" size="lg" variant="outline">
            Browse Reps Near Me
          </ButtonLink>
        </div>
      </section>

      {/* Two paths */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/requests/new"
          className="group rounded-xl border-2 border-primary/20 bg-card p-6 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarPlus className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Need a pitcher, hitter, or catcher?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Need a pitcher for live ABs? A hitter for your kid to throw to? A catcher
            for a bullpen or small group session? Post the time, place, age, and level
            and let nearby families respond.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Post a Request <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/availability/new"
          className="group rounded-xl border bg-card p-6 text-left transition-colors hover:border-muted-foreground/30 hover:bg-muted/40"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Want to offer availability?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Have a player who wants extra work? List open times for pitching, hitting,
            catching, or throwing so other families can book reps.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Share Availability <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      {/* Sample requests */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">See what families are posting</h2>
          <p className="mt-1 text-muted-foreground">
            Examples of the kind of reps you can find or post on {APP_NAME}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {SAMPLE_REQUESTS.map((request) => (
            <SampleRequestCard key={request.title} request={request} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">How it works</h2>
          <p className="mt-1 text-muted-foreground">
            From post to session in three steps
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div key={item.step} className="rounded-lg border bg-card p-5">
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
        <h2 className="text-center text-2xl font-bold">Keep it parent-run</h2>
        <p className="mx-auto max-w-2xl text-center text-muted-foreground">
          Parents coordinate directly, approve the match, and supervise sessions. No
          drop-offs, no mystery.
        </p>
        <SafetyNotice />
      </section>

      {/* Live requests */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Browse current requests</h2>
            <p className="mt-1 text-muted-foreground">
              Open rep needs from families near you
            </p>
          </div>
          <ButtonLink href="/requests" variant="outline">
            View all requests
          </ButtonLink>
        </div>
        {liveRequests && liveRequests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/30 px-6 py-10 text-center">
            <p className="text-muted-foreground">
              No open requests yet — be the first to post one.
            </p>
            <ButtonLink href="/requests/new" className="mt-4" size="sm">
              Post a Request
            </ButtonLink>
          </div>
        )}
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Coming soon: payments, background checks, and in-app messaging.
      </p>
    </div>
  );
}
