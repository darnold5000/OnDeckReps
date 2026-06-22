import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/button-link";
import { NavLinks } from "./nav-links";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <span className="text-lg">⚾</span>
          <span>{APP_NAME}</span>
        </Link>
        <NavLinks />
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <ButtonLink
                href="/dashboard"
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Dashboard
              </ButtonLink>
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                Log in
              </ButtonLink>
              <ButtonLink href="/signup" size="sm">
                Sign up
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
