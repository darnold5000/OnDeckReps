"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/requests", label: "Browse Requests" },
  { href: "/#how-it-works", label: "How It Works" },
];

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/requests", label: "Requests" },
  { href: "/availability", label: "Availability" },
  { href: "/dashboard#players", label: "Players" },
  { href: "/requests/new", label: "Create Request" },
];

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const basePath = href.split("#")[0];
  const isActive =
    pathname === basePath ||
    (basePath !== "/" && pathname.startsWith(basePath + "/")) ||
    (href.includes("#players") && pathname.startsWith("/players"));

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
        isActive ? "bg-muted text-foreground" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );
}

export function NavLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const links = isAuthenticated ? appLinks : publicLinks;

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href} label={link.label} pathname={pathname} />
      ))}
    </nav>
  );
}

export function MobileNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const links = isAuthenticated
    ? appLinks.slice(0, 4)
    : [
        { href: "/requests", label: "Browse" },
        { href: "/#how-it-works", label: "How It Works" },
        { href: "/signup", label: "Sign up" },
        { href: "/login", label: "Log in" },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex justify-around py-2">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            pathname={pathname}
          />
        ))}
      </div>
    </nav>
  );
}
