import { ArrowRight } from "lucide-react";

export function ListingCardFooter() {
  return (
    <p className="mt-3 flex min-h-11 items-center text-sm font-medium text-primary group-hover:underline">
      View details
      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </p>
  );
}
