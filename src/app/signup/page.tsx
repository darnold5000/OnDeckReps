import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { AuthForm } from "@/components/auth-form";
import { SafetyNotice } from "@/components/safety-notice";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Join {APP_NAME} to find and offer baseball reps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
        </CardContent>
      </Card>
      <SafetyNotice />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
