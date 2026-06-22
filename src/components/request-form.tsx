"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AGE_DIVISIONS,
  CONTACT_PREFERENCES,
  LOCATION_MODES,
  PAY_TYPES,
  REQUEST_TYPES,
  ROLES,
  TEAM_LEVELS,
  US_STATES,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/form-select";

export function RequestForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payType, setPayType] = useState("free");

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

    const requestType = form.get("request_type") as string;
    const roleMap: Record<string, string> = {
      need_pitcher: "pitcher",
      need_hitter: "hitter",
      need_catcher: "catcher",
      need_group_session: (form.get("role_needed") as string) || "hitter",
    };

    const payload = {
      user_id: user.id,
      request_type: requestType,
      title: form.get("title") as string,
      description: form.get("description") as string,
      age_division: form.get("age_division") as string,
      team_level: form.get("team_level") as string,
      role_needed: roleMap[requestType] ?? (form.get("role_needed") as string),
      spots_needed: parseInt(form.get("spots_needed") as string) || 1,
      session_date: form.get("session_date") as string,
      start_time: form.get("start_time") as string,
      end_time: (form.get("end_time") as string) || null,
      location_mode: form.get("location_mode") as string,
      location_name: (form.get("location_name") as string) || null,
      address: (form.get("address") as string) || null,
      city: form.get("city") as string,
      state: form.get("state") as string,
      pay_type: form.get("pay_type") as string,
      pay_amount:
        form.get("pay_type") === "paid" && form.get("pay_amount")
          ? parseFloat(form.get("pay_amount") as string)
          : null,
      contact_preference: form.get("contact_preference") as string,
      safety_notes: (form.get("safety_notes") as string) || null,
      status: "open",
    };

    const { data, error: dbError } = await supabase
      .from("rep_requests")
      .insert(payload)
      .select("id")
      .single();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push(`/requests/${data.id}`);
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
        <Label htmlFor="request_type">Request type *</Label>
        <FormSelect
          id="request_type"
          name="request_type"
          required
          placeholder="What do you need?"
          options={REQUEST_TYPES.map((t) => ({ value: t.value, label: t.label }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required placeholder="e.g. Need pitcher for live ABs" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="age_division">Age division *</Label>
          <FormSelect
            id="age_division"
            name="age_division"
            required
            placeholder="Select"
            options={AGE_DIVISIONS.map((d) => ({ value: d, label: d }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team_level">Team level</Label>
          <FormSelect
            id="team_level"
            name="team_level"
            defaultValue="unknown"
            options={TEAM_LEVELS.map((l) => ({
              value: l,
              label: l.charAt(0).toUpperCase() + l.slice(1),
            }))}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role_needed">Role needed (for group sessions)</Label>
          <FormSelect
            id="role_needed"
            name="role_needed"
            defaultValue="hitter"
            options={ROLES.map((r) => ({
              value: r,
              label: r.charAt(0).toUpperCase() + r.slice(1),
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spots_needed">Spots needed</Label>
          <Input
            id="spots_needed"
            name="spots_needed"
            type="number"
            min={1}
            defaultValue={1}
          />
        </div>
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

      <div className="space-y-2">
        <Label htmlFor="location_mode">Location mode *</Label>
        <FormSelect
          id="location_mode"
          name="location_mode"
          required
          defaultValue="provide"
          options={LOCATION_MODES.map((m) => ({ value: m.value, label: m.label }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_name">Location name</Label>
        <Input id="location_name" name="location_name" placeholder="e.g. Local field" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address or general area</Label>
        <Input id="address" name="address" />
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pay_type">Pay type *</Label>
          <FormSelect
            id="pay_type"
            name="pay_type"
            required
            defaultValue="free"
            onChange={(e) => setPayType(e.target.value)}
            options={PAY_TYPES.map((p) => ({ value: p.value, label: p.label }))}
          />
        </div>
        {payType === "paid" && (
          <div className="space-y-2">
            <Label htmlFor="pay_amount">Pay amount ($)</Label>
            <Input
              id="pay_amount"
              name="pay_amount"
              type="number"
              min={0}
              step="0.01"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_preference">Contact preference</Label>
        <FormSelect
          id="contact_preference"
          name="contact_preference"
          defaultValue="in_app"
          options={CONTACT_PREFERENCES.map((c) => ({
            value: c.value,
            label: c.label,
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="safety_notes">Safety notes / requirements</Label>
        <Textarea id="safety_notes" name="safety_notes" rows={2} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create request"}
      </Button>
    </form>
  );
}
