import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChipBadge } from "@/components/status-badges";

type SampleRequest = {
  title: string;
  location: string;
  when: string;
  chips: readonly string[];
  note: string;
};

export function SampleRequestCard({ request }: { request: SampleRequest }) {
  return (
    <Card className="border-dashed bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-snug">{request.title}</CardTitle>
        <CardDescription className="flex flex-wrap gap-1.5 pt-1">
          {request.chips.map((chip) => (
            <ChipBadge key={chip} label={chip} />
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>
          {request.location} · {request.when}
        </p>
        <p>{request.note}</p>
      </CardContent>
    </Card>
  );
}
