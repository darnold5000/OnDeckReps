import { ButtonLink } from "@/components/button-link";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  actionVariant?: "default" | "outline";
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  actionVariant = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed bg-muted/30 px-5 py-8 text-center",
        className
      )}
    >
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      <ButtonLink
        href={actionHref}
        variant={actionVariant}
        className="mt-4 min-h-11 w-full sm:w-auto"
      >
        {actionLabel}
      </ButtonLink>
    </div>
  );
}
