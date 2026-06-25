import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import { SafetyNotice } from "@/components/safety-notice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Get started" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signup");

  const [{ data: profile }, { data: players }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone, city").eq("id", user.id).single(),
    supabase.from("player_profiles").select("id").eq("user_id", user.id),
  ]);

  const hasProfile = !!(profile?.full_name && profile?.city);
  const hasPlayers = (players?.length ?? 0) > 0;

  if (hasProfile && hasPlayers) {
    redirect("/dashboard");
  }

  const steps = [
    {
      number: 1,
      title: "Complete parent profile",
      description: "Name, phone, and city so families can reach you.",
      done: hasProfile,
      href: "/dashboard",
      cta: "Complete profile",
      recommended: !hasProfile,
    },
    {
      number: 2,
      title: "Add your player",
      description: "Age division, roles, and team level for matching.",
      done: hasPlayers,
      href: "/players/new",
      cta: "Add player",
      recommended: hasProfile && !hasPlayers,
    },
    {
      number: 3,
      title: "Post a request or share availability",
      description: "Need reps? Post a request. Have open time? Share availability.",
      done: false,
      href: hasPlayers ? "/requests/new" : "/players/new",
      cta: hasPlayers ? "Post a request" : "Add player first",
      recommended: hasProfile && hasPlayers,
    },
  ];

  const nextStep = steps.find((s) => s.recommended) ?? steps.find((s) => !s.done);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome to OnDeck Reps</h1>
        <p className="text-sm text-muted-foreground">
          Three quick steps to find or offer live reps near you.
        </p>
      </div>

      {nextStep && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm font-medium text-primary">Recommended next step</p>
          <p className="mt-1 text-base font-semibold">{nextStep.title}</p>
          <ButtonLink href={nextStep.href} className="mt-3 min-h-11 w-full sm:w-auto">
            {nextStep.cta}
          </ButtonLink>
        </div>
      )}

      <div className="space-y-3">
        {steps.map((step) => (
          <Card
            key={step.number}
            className={cn(
              step.done && "border-emerald-200 bg-emerald-50/50",
              step.recommended && !step.done && "border-primary/30 ring-1 ring-primary/20"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    step.done
                      ? "bg-emerald-600 text-white"
                      : "bg-primary text-primary-foreground"
                  )}
                  aria-hidden
                >
                  {step.done ? "✓" : step.number}
                </span>
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            {!step.done && !step.recommended && (
              <CardContent className="pt-0">
                <ButtonLink href={step.href} size="sm" variant="outline" className="min-h-11 w-full sm:w-auto">
                  {step.cta}
                </ButtonLink>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <SafetyNotice />

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="underline">
          Skip for now — go to dashboard
        </Link>
      </p>
    </div>
  );
}
