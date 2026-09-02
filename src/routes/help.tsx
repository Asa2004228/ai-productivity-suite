import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Disclaimer } from "@/components/app-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — AI Workplace Assistant" },
      { name: "description", content: "How to get the best results from each AI tool." },
      { property: "og:title", content: "Help & Support" },
      { property: "og:description", content: "Guidance and answers for the AI workplace tools." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do I get better email results?",
    a: "Describe the situation, not just the request: who the reader is, what happened, what you want them to do and by when. The more specific your context, the more specific the email.",
  },
  {
    q: "Why does my schedule look different each time?",
    a: "The planner analyses your actual tasks, deadlines, priorities and estimates every time you generate. Regenerating produces a fresh plan based on your current inputs.",
  },
  {
    q: "Can I analyse a long article?",
    a: "Yes. Switch the Research Assistant to 'Paste text' and paste the full article. Very long documents may need to be split into sections.",
  },
  {
    q: "Where is my data stored?",
    a: "Saved outputs and settings are stored in your browser's local storage only. Clearing your browser data removes them.",
  },
  {
    q: "Can I edit AI output?",
    a: "Every result has Edit, Copy, Regenerate and Save. You stay in control of the final content.",
  },
];

function HelpPage() {
  return (
    <AppShell title="Help & Support" description="Short answers to the most common questions.">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently asked questions</CardTitle>
          <CardDescription>Tips for getting genuinely useful AI output.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      <Disclaimer />
    </AppShell>
  );
}
