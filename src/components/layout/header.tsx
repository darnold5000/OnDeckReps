import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/button-link";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";

export function Header({ user }: { user: User | null }) {
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center gap-1.5 font-bold text-primary"
        >
          <span className="text-lg" aria-hidden>
            ⚾
          </span>
          <span className="sm:hidden">OnDeck</span>
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>

        <NavLinks isAuthenticated={isAuthenticated} />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <form action="/auth/signout" method="post">
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="min-h-11 sm:min-h-0"
              >
                Log out
              </Button>
            </form>
          ) : (
            <>
              <ButtonLink
                href="/requests"
                variant="ghost"
                size="sm"
                className="min-h-11 px-2 sm:px-3 md:hidden"
              >
                Browse
              </ButtonLink>
              <ButtonLink
                href="/signup"
                size="sm"
                className="min-h-11 px-3"
              >
                Sign up
              </ButtonLink>
              <ButtonLink
                href="/login"
                variant="ghost"
                size="sm"
                className="hidden min-h-11 md:inline-flex"
              >
                Log in
              </ButtonLink>
              <MobileMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
