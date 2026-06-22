"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  AGE_DIVISIONS,
  ROLES,
  TEAM_LEVELS,
  US_STATES,
} from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function RequestFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/requests?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/requests");
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Filters</Label>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Age division</Label>
          <Select
            defaultValue={searchParams.get("division") ?? "all"}
            onValueChange={(v) => updateFilter("division", v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All divisions</SelectItem>
              {AGE_DIVISIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Role needed</Label>
          <Select
            defaultValue={searchParams.get("role") ?? "all"}
            onValueChange={(v) => updateFilter("role", v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r} className="capitalize">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Team level</Label>
          <Select
            defaultValue={searchParams.get("level") ?? "all"}
            onValueChange={(v) => updateFilter("level", v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {TEAM_LEVELS.map((l) => (
                <SelectItem key={l} value={l} className="capitalize">
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">State</Label>
          <Select
            defaultValue={searchParams.get("state") ?? "all"}
            onValueChange={(v) => updateFilter("state", v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">City</Label>
          <Input
            className="h-9"
            placeholder="Filter by city"
            defaultValue={searchParams.get("city") ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("city", (e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Date</Label>
          <Input
            className="h-9"
            type="date"
            defaultValue={searchParams.get("date") ?? ""}
            onChange={(e) => updateFilter("date", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
