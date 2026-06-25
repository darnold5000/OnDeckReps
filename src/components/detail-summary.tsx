import { cn } from "@/lib/utils";

type DetailRow = {
  label: string;
  value: React.ReactNode;
};

type DetailSummaryProps = {
  title: string;
  badge?: React.ReactNode;
  chips?: React.ReactNode;
  rows: DetailRow[];
  className?: string;
};

export function DetailSummary({
  title,
  badge,
  chips,
  rows,
  className,
}: DetailSummaryProps) {
  return (
    <section
      className={cn("rounded-xl border bg-card p-4 sm:p-5", className)}
      aria-label="Summary"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h1 className="text-xl font-bold leading-snug sm:text-2xl">{title}</h1>
        {badge}
      </div>
      {chips && (
        <div className="mt-3 flex flex-wrap gap-1.5">{chips}</div>
      )}
      <dl className="mt-4 grid gap-2.5 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {row.label}
            </dt>
            <dd className="mt-0.5 font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
