import { Alert, AlertDescription } from "@/components/ui/alert";
import { SAFETY_NOTICE } from "@/lib/constants";
import { Shield } from "lucide-react";

export function SafetyNotice() {
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
      <Shield className="h-4 w-4" />
      <AlertDescription className="text-sm">{SAFETY_NOTICE}</AlertDescription>
    </Alert>
  );
}
