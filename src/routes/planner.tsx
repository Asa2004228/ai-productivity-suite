import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Disclaimer } from "@/components/app-shell";
import { OutputActions } from "@/components/output-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { runAI, type PlannerResult } from "@/lib/ai.functions";
import { saveItem } from "@/lib/saved";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn your real tasks, deadlines and priorities into a personalised AI-built schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "A personalised schedule generated from your own tasks and deadlines.",
      },
    ],
  }),
  component: PlannerPage,
});

type Horizon = "Today" | "Tomorrow" | "This Week";
type Task = {
  id: string;
  title: string;
  deadline: string;
  priority: string;
  estimate: string;
  done: boolean;
};

const newTask = (): Task => ({
  id: crypto.randomUUID(),
  title: "",
  deadline: "",
  priority: "Medium",
  estimate: "",
  done: false,
});

function PlannerPage() {
  const generate = useServerFn(runAI);
  const [horizon, setHorizon] = useState<Horizon>("Today");
  const [tasks, setTasks] = useState<Task[]>([newTask()]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState<PlannerResult | null>(null);

  function update(id: string, patch: Partial<Task>) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function move(index: number, dir: -1 | 1) {
    setTasks((t) => {
      const target = index + dir;
      if (target < 0 || target >= t.length) return t;
      const next = [...t];
      const a = next[index]!;
      const b = next[target]!;
      next[index] = b;
      next[target] = a;
      return next;
    });
  }

  async function run() {
    const active = tasks.filter((t) => t.title.trim() && !t.done);
    if (active.length === 0) {
      toast.error("Add at least one task first.");
      return;
    }
    setBusy(true);
    try {
      const out = (await generate({
        data: {
          kind: "planner",
          horizon,
          notes,
          tasks: active.map((t) => ({
            title: t.title,
            deadline: t.deadline,
            priority: t.priority,
            estimate: t.estimate,
          })),
        },
      })) as PlannerResult;
      setResult(out);
      setEditing(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }

  const asText = () =>
    result
      ? `${horizon} plan\n\n${result.summary}\n\n` +
        result.schedule
          .map((s) => `${s.time} — ${s.task} (${s.priority}, ${s.duration})\n  ${s.why}`)
          .join("\n")
      : "";

  return (
    <AppShell
      title="AI Task Planner"
      description="Enter your real tasks — the AI sequences them by urgency, deadline and workload."
    >
      <Card>
        <CardContent className="grid gap-5 pt-6">
          <div className="grid gap-2 sm:max-w-xs">
            <Label>Plan for</Label>
            <Select value={horizon} onValueChange={(v) => setHorizon(v as Horizon)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Today", "Tomorrow", "This Week"].map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label>Tasks</Label>
            {tasks.map((t, i) => (
              <div
                key={t.id}
                className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[auto_2fr_1fr_1fr_1fr_auto] sm:items-center"
              >
                <Checkbox
                  checked={t.done}
                  onCheckedChange={(v) => update(t.id, { done: Boolean(v) })}
                  aria-label="Mark complete"
                />
                <Input
                  placeholder="Task"
                  value={t.title}
                  className={t.done ? "line-through opacity-60" : ""}
                  onChange={(e) => update(t.id, { title: e.target.value })}
                />
                <Input
                  placeholder="Deadline"
                  value={t.deadline}
                  onChange={(e) => update(t.id, { deadline: e.target.value })}
                />
                <Select value={t.priority} onValueChange={(v) => update(t.id, { priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["High", "Medium", "Low"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Est. time"
                  value={t.estimate}
                  onChange={(e) => update(t.id, { estimate: e.target.value })}
                />
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => move(i, -1)}>
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => move(i, 1)}>
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTasks((x) => x.filter((y) => y.id !== t.id))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setTasks((t) => [...t, newTask()])}>
              <Plus className="size-4" /> Add task
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes / constraints (optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="e.g. I'm in meetings 10:00–12:00 and prefer deep work in the morning."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div>
            <Button onClick={run} disabled={busy}>
              {busy ? "Planning…" : "Generate schedule"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="text-base">{horizon} schedule</CardTitle>
            <OutputActions
              editing={editing}
              busy={busy}
              onToggleEdit={() => setEditing((v) => !v)}
              onCopy={asText}
              onRegenerate={run}
              onSave={() => {
                saveItem("planner", `${horizon} schedule`, asText());
                toast.success("Saved to Saved Outputs");
              }}
            />
          </CardHeader>
          <CardContent className="grid gap-4">
            {editing ? (
              <Textarea
                rows={4}
                value={result.summary}
                onChange={(e) => setResult({ ...result, summary: e.target.value })}
              />
            ) : (
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            )}
            <ul className="grid gap-2">
              {result.schedule.map((s, i) => (
                <li key={i} className="rounded-lg border border-border p-3">
                  {editing ? (
                    <div className="grid gap-2 sm:grid-cols-[1fr_2fr]">
                      <Input
                        value={s.time}
                        onChange={(e) => {
                          const next = [...result.schedule];
                          next[i] = { ...s, time: e.target.value };
                          setResult({ ...result, schedule: next });
                        }}
                      />
                      <Input
                        value={s.task}
                        onChange={(e) => {
                          const next = [...result.schedule];
                          next[i] = { ...s, task: e.target.value };
                          setResult({ ...result, schedule: next });
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="text-sm font-semibold text-primary">{s.time}</span>
                        <span className="text-sm font-medium text-foreground">{s.task}</span>
                        <span className="text-xs text-muted-foreground">
                          {s.priority} · {s.duration}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{s.why}</p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Disclaimer />
    </AppShell>
  );
}
