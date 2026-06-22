"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { US_STATES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSelect } from "@/components/form-select";

type ProfileFormProps = {
  profile: Profile | null;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const payload = {
      id: user.id,
      full_name: form.get("full_name") as string,
      phone: form.get("phone") as string,
      city: form.get("city") as string,
      state: form.get("state") as string,
    };

    const { error: dbError } = await supabase
      .from("profiles")
      .upsert(payload);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
          Profile updated!
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile?.full_name ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={profile?.city ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <FormSelect
            id="state"
            name="state"
            defaultValue={profile?.state ?? ""}
            placeholder="State"
            options={US_STATES.map((s) => ({ value: s, label: s }))}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
