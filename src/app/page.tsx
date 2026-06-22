import { ButtonLink } from "@/components/button-link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-12 py-8 text-center md:py-16">
      <div className="space-y-4">
        <p className="text-5xl">⚾</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          {APP_NAME}
        </h1>
        <p className="mx-auto max-w-lg text-lg text-muted-foreground md:text-xl">
          Find live baseball reps near you.
        </p>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Book pitchers, hitters, and catchers for live ABs, bullpens, and small
          group sessions.
        </p>
        <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/signup" size="lg">
          Sign up
        </ButtonLink>
        <ButtonLink href="/login" size="lg" variant="outline">
          Log in
        </ButtonLink>
        <ButtonLink href="/requests" size="lg" variant="secondary">
          Browse Requests
        </ButtonLink>
      </div>

      <div className="grid w-full max-w-3xl gap-4 text-left sm:grid-cols-3">
        {[
          {
            title: "Post a request",
            desc: "Need a pitcher, hitter, or catcher? Create a request and find reps nearby.",
          },
          {
            title: "Share availability",
            desc: "Let other families know when your player is available for live reps.",
          },
          {
            title: "Connect safely",
            desc: "Parents coordinate sessions directly. Always supervise youth players.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {/* TODO: Payments, background checks, maps, real-time chat, push notifications, ratings/reviews, calendar sync */}
        Coming soon: payments, background checks, and in-app messaging.
      </p>
    </div>
  );
}
