"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AGE_DIVISIONS,
  BATS_OPTIONS,
  ROLES,
  TEAM_LEVELS,
  THROWS_OPTIONS,
  US_STATES,
} from "@/lib/constants";
import type { PlayerProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/form-select";

type PlayerFormProps = {
  player?: PlayerProfile;
};

export function PlayerForm({ player }: PlayerFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    player?.roles ?? []
  );

  function toggleRole(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

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

    if (selectedRoles.length === 0) {
      setError("Select at least one role.");
      setLoading(false);
      return;
    }

    const payload = {
      user_id: user.id,
      player_name: form.get("player_name") as string,
      birth_year: form.get("birth_year")
        ? parseInt(form.get("birth_year") as string)
        : null,
      age_division: form.get("age_division") as string,
      roles: selectedRoles,
      throws: form.get("throws") as string,
      bats: form.get("bats") as string,
      team_level: form.get("team_level") as string,
      city: form.get("city") as string,
      state: form.get("state") as string,
      travel_radius_miles: form.get("travel_radius_miles")
        ? parseInt(form.get("travel_radius_miles") as string)
        : null,
      bio: form.get("bio") as string,
    };

    const { error: dbError } = player
      ? await supabase
          .from("player_profiles")
          .update(payload)
          .eq("id", player.id)
      : await supabase.from("player_profiles").insert(payload);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="player_name">Player name *</Label>
        <Input
          id="player_name"
          name="player_name"
          required
          defaultValue={player?.player_name}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="birth_year">Birth year</Label>
          <Input
            id="birth_year"
            name="birth_year"
            type="number"
            min={2000}
            max={2020}
            defaultValue={player?.birth_year ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age_division">Age division *</Label>
          <FormSelect
            id="age_division"
            name="age_division"
            required
            defaultValue={player?.age_division ?? ""}
            placeholder="Select division"
            options={AGE_DIVISIONS.map((d) => ({ value: d, label: d }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Primary roles *</Label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <Button
              key={role}
              type="button"
              size="sm"
              variant={selectedRoles.includes(role) ? "default" : "outline"}
              onClick={() => toggleRole(role)}
              className="capitalize"
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="throws">Throws</Label>
          <FormSelect
            id="throws"
            name="throws"
            defaultValue={player?.throws ?? "unknown"}
            options={THROWS_OPTIONS.map((o) => ({
              value: o,
              label: o.charAt(0).toUpperCase() + o.slice(1),
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bats">Bats</Label>
          <FormSelect
            id="bats"
            name="bats"
            defaultValue={player?.bats ?? "unknown"}
            options={BATS_OPTIONS.map((o) => ({
              value: o,
              label: o.charAt(0).toUpperCase() + o.slice(1),
            }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="team_level">Team level</Label>
        <FormSelect
          id="team_level"
          name="team_level"
          defaultValue={player?.team_level ?? "unknown"}
          options={TEAM_LEVELS.map((l) => ({
            value: l,
            label: l.charAt(0).toUpperCase() + l.slice(1),
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={player?.city ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <FormSelect
            id="state"
            name="state"
            defaultValue={player?.state ?? ""}
            placeholder="State"
            options={US_STATES.map((s) => ({ value: s, label: s }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="travel_radius_miles">Travel radius (miles)</Label>
        <Input
          id="travel_radius_miles"
          name="travel_radius_miles"
          type="number"
          min={0}
          defaultValue={player?.travel_radius_miles ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio / notes</Label>
        <Textarea id="bio" name="bio" rows={3} defaultValue={player?.bio ?? ""} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : player ? "Update player" : "Add player"}
      </Button>
    </form>
  );
}
