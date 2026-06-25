import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { cn } from "@/lib/utils";

type PathCardProps = {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary";
};

export function PathCard({
  title,
  description,
  ctaLabel,
  href,
  icon: Icon,
  variant = "secondary",
}: PathCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border p-5 text-left",
        isPrimary
          ? "border-primary/25 bg-primary/5"
          : "border-border bg-card"
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-lg",
          isPrimary ? "bg-primary/15 text-primary" : "bg-muted text-foreground"
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold leading-snug">{title}</h2>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
      <ButtonLink
        href={href}
        variant={isPrimary ? "default" : "outline"}
        className="mt-4 min-h-11 w-full"
      >
        {ctaLabel}
      </ButtonLink>
    </div>
  );
}
