"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/requests", label: "Requests" },
  { href: "/availability", label: "Availability" },
  { href: "/requests/new", label: "Create" },
  { href: "/players/new", label: "Add Player" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
            pathname === link.href || pathname.startsWith(link.href + "/")
              ? "bg-muted text-foreground"
              : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex justify-around py-2">
        {links.slice(0, 4).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center px-2 py-1 text-xs",
              pathname === link.href || pathname.startsWith(link.href + "/")
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
