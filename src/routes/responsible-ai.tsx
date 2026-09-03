import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "How AI Workplace Productivity Assistant uses AI responsibly and how you should review generated content.",
      },
      { property: "og:title", content: "Responsible AI" },
      {
        property: "og:description",
        content:
          "Guidelines for using AI-generated emails, schedules and research safely and responsibly.",
      },
    ],
  }),
  component: ResponsibleAIPage,
});

function ResponsibleAIPage() {
  return (
    <AppShell
      title="Responsible AI"
      description="Using AI thoughtfully, transparently and safely."
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Human-in-the-loop</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>
              AI Workplace Productivity Assistant is designed to help you draft, plan and analyse —
              not to replace your judgement. Every output is editable, and you decide what to send,
              schedule or share.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review before you rely on it</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>
              AI-generated content may contain errors, omissions or outdated information. Always
              review facts, figures, names, dates and tone before using the output for important
              decisions, client communication or compliance tasks.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Privacy and data handling</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>
              Your inputs are sent to an AI model to generate responses. Do not paste sensitive
              personal data, passwords, confidential client information or regulated data unless you
              are authorised to do so. Saved outputs are stored only in this browser's local
              storage.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fairness and limitations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>
              AI can reflect patterns in its training data and may not account for your
              organisation's specific policies, culture or local regulations. Use the output as a
              starting point, not a final authority.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your responsibility</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p>
              You remain responsible for the final content and decisions you make. If something
              feels wrong, unclear or inappropriate, edit it or regenerate it before using it.
            </p>
          </CardContent>
        </Card>

        <p className="rounded-lg border border-border bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          AI-generated content may contain errors or omissions. Always review and verify important
          information before relying on it. You remain responsible for the final content and
          decisions you make.
        </p>
      </div>
    </AppShell>
  );
}
