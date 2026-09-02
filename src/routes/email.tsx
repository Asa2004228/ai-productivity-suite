import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Disclaimer } from "@/components/app-shell";
import { OutputActions } from "@/components/output-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { runAI, type EmailResult } from "@/lib/ai.functions";
import { saveItem } from "@/lib/saved";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content: "Generate context-specific professional emails with your chosen tone and length.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "AI-written professional emails based on your own context.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";
type Length = "Short" | "Medium" | "Detailed";

function EmailPage() {
  const generate = useServerFn(runAI);
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [length, setLength] = useState<Length>("Medium");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);

  async function run() {
    if (!context.trim()) {
      toast.error("Describe the purpose of the email first.");
      return;
    }
    setBusy(true);
    console.log("RUN start");
    try {
      const out = (await generate({
        data: { kind: "email", context, recipient, tone, length },
      })) as EmailResult;
      setResult(out);
      setEditing(false);
    } catch (e) {
      console.log("RUN error", String(e));
      toast.error(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }

  const asText = () => (result ? `Subject: ${result.subject}\n\n${result.body}` : "");

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe what you need to say — the AI writes it in your tone and length."
    >
      <Card>
        <CardContent className="grid gap-5 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="context">Email purpose / context</Label>
            <Textarea
              id="context"
              rows={5}
              placeholder="e.g. Ask the finance team for an extension on the Q3 budget submission because our vendor data arrives late..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Thandi, Finance Manager"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
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
              <Label>Length</Label>
              <Select value={length} onValueChange={(v) => setLength(v as Length)}>
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
          </div>
          <div>
            <Button onClick={run} disabled={busy}>
              {busy ? "Generating…" : "Generate email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="text-base">Generated email</CardTitle>
            <OutputActions
              editing={editing}
              busy={busy}
              onToggleEdit={() => setEditing((v) => !v)}
              onCopy={asText}
              onRegenerate={run}
              onSave={() => {
                saveItem("email", result.subject || "Untitled email", asText());
                toast.success("Saved to Saved Outputs");
              }}
            />
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Subject</Label>
              {editing ? (
                <Input
                  value={result.subject}
                  onChange={(e) => setResult({ ...result, subject: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium text-foreground">{result.subject}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Body</Label>
              {editing ? (
                <Textarea
                  rows={14}
                  value={result.body}
                  onChange={(e) => setResult({ ...result, body: e.target.value })}
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {result.body}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Disclaimer />
    </AppShell>
  );
}
