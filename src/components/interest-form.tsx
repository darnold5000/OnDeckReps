"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EmptyState } from "@/components/empty-state";
import type { PlayerProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/form-select";

type InterestFormProps = {
  requestId: string;
  players: PlayerProfile[];
};

export function InterestForm({ requestId, players }: InterestFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const payload = {
      request_id: requestId,
      user_id: user.id,
      player_profile_id: form.get("player_profile_id") as string,
      message: (form.get("message") as string) || null,
      suggested_location: (form.get("suggested_location") as string) || null,
      suggested_price: form.get("suggested_price")
        ? parseFloat(form.get("suggested_price") as string)
        : null,
      status: "pending",
    };

    const { error: dbError } = await supabase
      .from("request_responses")
      .insert(payload);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return (
      <p className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">
        Your interest has been submitted! The request owner will see your player
        and message.
      </p>
    );
  }

  if (players.length === 0) {
    return (
      <EmptyState
        title="Add a player first"
        description="You need a player profile before you can respond to rep requests."
        actionLabel="Add Player"
        actionHref="/players/new"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="player_profile_id">Which player is available? *</Label>
        <FormSelect
          id="player_profile_id"
          name="player_profile_id"
          required
          placeholder="Select your player"
          options={players.map((p) => ({
            value: p.id,
            label: `${p.player_name} (${p.age_division})`,
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message to the requesting family</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Share your player's experience, schedule flexibility, and anything helpful for this session..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suggested_location">Suggested location (optional)</Label>
        <Input
          id="suggested_location"
          name="suggested_location"
          placeholder="Field name, facility, or area"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suggested_price">Suggested price (optional)</Label>
        <Input
          id="suggested_price"
          name="suggested_price"
          type="number"
          min={0}
          step="0.01"
          placeholder="0.00"
        />
      </div>

      <Button type="submit" disabled={loading} className="min-h-11 w-full">
        {loading ? "Submitting..." : "I'm interested"}
      </Button>
    </form>
  );
}
