"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/login", label: "Log in" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {open && (
        <nav
          className="absolute left-0 right-0 top-14 z-50 border-b bg-background px-4 py-2 shadow-sm"
          aria-label="Mobile menu"
        >
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-foreground hover:bg-muted"
              )}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
