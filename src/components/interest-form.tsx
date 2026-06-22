"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
        Your interest has been submitted! The request owner will be notified.
      </p>
    );
  }

  if (players.length === 0) {
    return (
      <p className="text-muted-foreground">
        <a href="/players/new" className="text-primary underline">
          Add a player profile
        </a>{" "}
        to respond to this request.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="player_profile_id">Your player *</Label>
        <FormSelect
          id="player_profile_id"
          name="player_profile_id"
          required
          placeholder="Select player"
          options={players.map((p) => ({
            value: p.id,
            label: `${p.player_name} (${p.age_division})`,
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Tell them about your player and availability..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suggested_location">Suggested location (optional)</Label>
        <Input id="suggested_location" name="suggested_location" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="suggested_price">Suggested price (optional)</Label>
        <Input
          id="suggested_price"
          name="suggested_price"
          type="number"
          min={0}
          step="0.01"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "I'm interested"}
      </Button>
    </form>
  );
}
