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
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => updateStatus("filled")}>
        Mark as filled
      </Button>
      <Button size="sm" variant="outline" onClick={() => updateStatus("cancelled")}>
        Cancel request
      </Button>
    </div>
  );
}
