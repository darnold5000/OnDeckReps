"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PAY_TYPES, ROLES, US_STATES } from "@/lib/constants";
import type { PlayerProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/form-select";

type AvailabilityFormProps = {
  players: PlayerProfile[];
};

export function AvailabilityForm({ players }: AvailabilityFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canTravel, setCanTravel] = useState(true);
  const [hasLocation, setHasLocation] = useState(false);

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
      user_id: user.id,
      player_profile_id: form.get("player_profile_id") as string,
      available_role: form.get("available_role") as string,
      session_date: form.get("session_date") as string,
      start_time: form.get("start_time") as string,
      end_time: (form.get("end_time") as string) || null,
      city: form.get("city") as string,
      state: form.get("state") as string,
      can_travel: canTravel,
      travel_radius_miles: canTravel && form.get("travel_radius_miles")
        ? parseInt(form.get("travel_radius_miles") as string)
        : null,
      has_location_access: hasLocation,
      location_details: (form.get("location_details") as string) || null,
      pay_expectation: form.get("pay_expectation") as string,
      notes: (form.get("notes") as string) || null,
      status: "open",
    };

    const { data, error: dbError } = await supabase
      .from("availability_posts")
      .insert(payload)
      .select("id")
      .single();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push(`/availability/${data.id}`);
    router.refresh();
  }

  if (players.length === 0) {
    return (
      <p className="text-muted-foreground">
        You need to{" "}
        <a href="/players/new" className="text-primary underline">
          add a player profile
        </a>{" "}
        first.
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
        <Label htmlFor="player_profile_id">Player profile *</Label>
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
        <Label htmlFor="available_role">Available role *</Label>
        <FormSelect
          id="available_role"
          name="available_role"
          required
          placeholder="Select role"
          options={ROLES.map((r) => ({
            value: r,
            label: r.charAt(0).toUpperCase() + r.slice(1),
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="session_date">Date *</Label>
          <Input id="session_date" name="session_date" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_time">Start time *</Label>
          <Input id="start_time" name="start_time" type="time" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End time</Label>
          <Input id="end_time" name="end_time" type="time" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="city">City *</Label>
          <Input id="city" name="city" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <FormSelect
            id="state"
            name="state"
            required
            placeholder="State"
            options={US_STATES.map((s) => ({ value: s, label: s }))}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={canTravel}
            onChange={(e) => setCanTravel(e.target.checked)}
          />
          Can travel
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasLocation}
            onChange={(e) => setHasLocation(e.target.checked)}
          />
          Has location access
        </label>
      </div>

      {canTravel && (
        <div className="space-y-2">
          <Label htmlFor="travel_radius_miles">Travel radius (miles)</Label>
          <Input
            id="travel_radius_miles"
            name="travel_radius_miles"
            type="number"
            min={0}
            defaultValue={15}
          />
        </div>
      )}

      {hasLocation && (
        <div className="space-y-2">
          <Label htmlFor="location_details">Location details</Label>
          <Input id="location_details" name="location_details" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="pay_expectation">Pay expectation</Label>
        <FormSelect
          id="pay_expectation"
          name="pay_expectation"
          defaultValue="free"
          options={PAY_TYPES.map((p) => ({ value: p.value, label: p.label }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Posting..." : "Post availability"}
      </Button>
    </form>
  );
}
