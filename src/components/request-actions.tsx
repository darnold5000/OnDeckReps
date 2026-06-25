"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function RequestActions({
  requestId,
  status,
}: {
  requestId: string;
  status: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function updateStatus(newStatus: string) {
    await supabase
      .from("rep_requests")
      .update({ status: newStatus })
      .eq("id", requestId);
    router.refresh();
  }

  if (status !== "open") return null;

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <Button
        size="sm"
        className="min-h-11 w-full sm:w-auto"
        onClick={() => updateStatus("filled")}
      >
        Mark as filled
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="min-h-11 w-full sm:w-auto"
        onClick={() => updateStatus("cancelled")}
      >
        Cancel request
      </Button>
    </div>
  );
}
