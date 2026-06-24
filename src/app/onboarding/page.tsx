import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SafetyNotice } from "@/components/safety-notice";

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
      title: "Complete your parent profile",
      description: "Add your name, phone, and location so other families can reach you.",
      done: hasProfile,
      href: "/dashboard",
      cta: "Complete profile",
    },
    {
      number: 2,
      title: "Add your player",
      description: "Set age division, roles (pitcher, hitter, catcher), and team level.",
      done: hasPlayers,
      href: "/players/new",
      cta: "Add player",
    },
    {
      number: 3,
      title: "Post or respond",
      description:
        "Need reps? Post a request. Have a player with open time? Share availability.",
      done: false,
      href: hasPlayers ? "/requests/new" : "/players/new",
      cta: hasPlayers ? "Post a request" : "Add player first",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome to OnDeck Reps</h1>
        <p className="text-muted-foreground">
          Three quick steps and you&apos;re ready to find or offer live reps.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <Card key={step.number} className={step.done ? "border-emerald-200 bg-emerald-50/50" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    step.done
                      ? "bg-emerald-600 text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {step.done ? "✓" : step.number}
                </span>
                <div className="space-y-1">
                  <CardTitle className="text-base">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            {!step.done && (
              <CardContent>
                <ButtonLink href={step.href} size="sm">
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
