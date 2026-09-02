import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Disclaimer } from "@/components/app-shell";
import { OutputActions } from "@/components/output-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { runAI, type ResearchResult } from "@/lib/ai.functions";
import { saveItem } from "@/lib/saved";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Analyse a topic or pasted text into an executive summary, key points, insights and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Executive summaries, insights and recommendations from your own material.",
      },
    ],
  }),
  component: ResearchPage,
});

type Mode = "topic" | "text";

const sections: { key: keyof ResearchResult; label: string }[] = [
  { key: "keyPoints", label: "Key points" },
  { key: "keyInsights", label: "Key insights" },
  { key: "recommendations", label: "Recommendations" },
  { key: "furtherQuestions", label: "Questions for further research" },
];

function ResearchPage() {
  const generate = useServerFn(runAI);
  const [mode, setMode] = useState<Mode>("topic");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function run() {
    if (!content.trim()) {
      toast.error("Enter a topic or paste some text first.");
      return;
    }
    setBusy(true);
    try {
      const out = (await generate({ data: { kind: "research", mode, content } })) as ResearchResult;
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
      ? `Executive summary\n${result.executiveSummary}\n\n` +
        sections
          .map(
            (s) =>
              `${s.label}\n${(result[s.key] as string[]).map((x) => `- ${x}`).join("\n")}\n`,
          )
          .join("\n")
      : "";

  return (
    <AppShell
      title="AI Research Assistant"
      description="Analyse a research topic or your own pasted article."
    >
      <Card>
        <CardContent className="grid gap-5 pt-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList>
              <TabsTrigger value="topic">Research topic</TabsTrigger>
              <TabsTrigger value="text">Paste text</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid gap-2">
            <Label htmlFor="content">{mode === "topic" ? "Topic" : "Article or text"}</Label>
            <Textarea
              id="content"
              rows={mode === "topic" ? 3 : 12}
              placeholder={
                mode === "topic"
                  ? "e.g. Impact of four-day work weeks on knowledge-worker productivity in South Africa"
                  : "Paste the article or document text here…"
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <Button onClick={run} disabled={busy}>
              {busy ? "Analysing…" : "Analyse"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="text-base">Analysis</CardTitle>
            <OutputActions
              editing={editing}
              busy={busy}
              onToggleEdit={() => setEditing((v) => !v)}
              onCopy={asText}
              onRegenerate={run}
              onSave={() => {
                saveItem("research", content.slice(0, 60) || "Research analysis", asText());
                toast.success("Saved to Saved Outputs");
              }}
            />
          </CardHeader>
          <CardContent className="grid gap-6">
            <section className="grid gap-2">
              <h2 className="text-sm font-semibold text-foreground">Executive summary</h2>
              {editing ? (
                <Textarea
                  rows={5}
                  value={result.executiveSummary}
                  onChange={(e) => setResult({ ...result, executiveSummary: e.target.value })}
                />
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {result.executiveSummary}
                </p>
              )}
            </section>
            {sections.map(({ key, label }) => (
              <section key={key} className="grid gap-2">
                <h2 className="text-sm font-semibold text-foreground">{label}</h2>
                {editing ? (
                  <Textarea
                    rows={5}
                    value={(result[key] as string[]).join("\n")}
                    onChange={(e) =>
                      setResult({ ...result, [key]: e.target.value.split("\n") } as ResearchResult)
                    }
                  />
                ) : (
                  <ul className="grid list-disc gap-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {(result[key] as string[]).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </CardContent>
        </Card>
      )}

      <Disclaimer />
    </AppShell>
  );
}
