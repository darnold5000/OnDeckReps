import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RequestForm } from "@/components/request-form";
import { SafetyNotice } from "@/components/safety-notice";

export const metadata = { title: "Create Request" };

export default async function NewRequestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Post a request</h1>
        <p className="text-sm text-muted-foreground">
          Tell nearby families what you need — role, level, time, and place.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Request details</CardTitle>
          <CardDescription>
            Be specific about role, level, and location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestForm />
        </CardContent>
      </Card>

      <SafetyNotice />

      <p className="text-sm text-muted-foreground">
        <Link href="/dashboard" className="underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
