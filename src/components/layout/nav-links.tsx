"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const publicDesktopLinks = [
  { href: "/requests", label: "Browse Requests" },
  { href: "/#how-it-works", label: "How It Works" },
];

const appDesktopLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/requests", label: "Requests" },
  { href: "/availability", label: "Availability" },
  { href: "/dashboard#players", label: "Players" },
  { href: "/requests/new", label: "Create Request" },
];

const appMobileLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/requests", label: "Requests" },
  { href: "/availability", label: "Avail." },
  { href: "/dashboard#players", label: "Players" },
  { href: "/requests/new", label: "Post" },
];

function isLinkActive(href: string, pathname: string) {
  const basePath = href.split("#")[0];
  if (href.includes("#players") && pathname.startsWith("/players")) return true;
  if (pathname === basePath) return true;
  if (basePath !== "/" && pathname.startsWith(basePath + "/")) return true;
  return false;
}

function NavLink({
  href,
  label,
  pathname,
  className,
}: {
  href: string;
  label: string;
  pathname: string;
  className?: string;
}) {
  const active = isLinkActive(href, pathname);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted min-h-11 inline-flex items-center",
        active ? "bg-muted text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
}

export function NavLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const links = isAuthenticated ? appDesktopLinks : publicDesktopLinks;

  return (
    <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href} label={link.label} pathname={pathname} />
      ))}
    </nav>
  );
}

export function MobileNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden"
      aria-label="Mobile app navigation"
    >
      <div className="mx-auto flex max-w-5xl">
        {appMobileLinks.map((link) => {
          const active = isLinkActive(link.href, pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium leading-tight sm:text-xs",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
