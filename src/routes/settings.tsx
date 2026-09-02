import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, Disclaimer } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Assistant" },
      { name: "description", content: "Set your name, default tone and default email length." },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Personalise your AI workplace assistant defaults." },
    ],
  }),
  component: SettingsPage,
});

const KEY = "awpa.settings";
type Prefs = { name: string; role: string; tone: string; length: string };
const defaults: Prefs = { name: "", role: "", tone: "Formal", length: "Medium" };

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...defaults, ...(JSON.parse(raw) as Prefs) });
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AppShell title="Settings" description="Preferences are stored in this browser only.">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your defaults</CardTitle>
          <CardDescription>Used as starting values across the AI tools.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              value={prefs.name}
              onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Job title</Label>
            <Input
              id="role"
              value={prefs.role}
              onChange={(e) => setPrefs({ ...prefs, role: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Default tone</Label>
            <Select value={prefs.tone} onValueChange={(v) => setPrefs({ ...prefs, tone: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Formal", "Friendly", "Persuasive"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Default email length</Label>
            <Select value={prefs.length} onValueChange={(v) => setPrefs({ ...prefs, length: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Short", "Medium", "Detailed"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Button
              onClick={() => {
                localStorage.setItem(KEY, JSON.stringify(prefs));
                toast.success("Settings saved");
              }}
            >
              Save settings
            </Button>
          </div>
        </CardContent>
      </Card>
      <Disclaimer />
    </AppShell>
  );
}
