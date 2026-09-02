import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, CalendarClock, BookOpenText, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell, Disclaimer } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSaved, kindLabel, type SavedItem } from "@/lib/saved";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Write emails, plan your day and analyse research with AI. Work smarter, not harder.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "AI tools for professional emails, task planning and research analysis.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email",
    title: "Smart Email Generator",
    desc: "Draft professional emails from your context, tone and length.",
    icon: Mail,
  },
  {
    to: "/planner",
    title: "AI Task Planner",
    desc: "Turn your tasks, deadlines and priorities into a realistic schedule.",
    icon: CalendarClock,
  },
  {
    to: "/research",
    title: "AI Research Assistant",
    desc: "Summarise topics or pasted text into insights and recommendations.",
    icon: BookOpenText,
  },
] as const;

function Dashboard() {
  const [items, setItems] = useState<SavedItem[]>([]);
  useEffect(() => setItems(getSaved().slice(0, 5)), []);

  return (
    <AppShell title="AI Workplace Productivity Assistant" description="Work smarter, not harder.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ to, title, desc, icon: Icon }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
          <CardDescription>Your latest saved outputs, stored in this browser.</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing yet — generate and save an output to see it here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{i.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {kindLabel[i.kind]} · {new Date(i.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Link to="/saved" className="text-sm font-medium text-primary">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Disclaimer />
    </AppShell>
  );
}
