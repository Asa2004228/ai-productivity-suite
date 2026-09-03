import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  CalendarClock,
  BookOpenText,
  Bookmark,
  Settings,
  LifeBuoy,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "AI Research Assistant", icon: BookOpenText },
  { to: "/saved", label: "Saved Outputs", icon: Bookmark },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help & Support", icon: LifeBuoy },
] as const;

export function Disclaimer() {
  return (
    <p className="mt-8 rounded-lg border border-border bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      AI-generated content may contain errors or omissions. Always review and verify important
      information before relying on it. You remain responsible for the final content and decisions
      you make.
    </p>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
        >
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden w-72 shrink-0 flex-col bg-sidebar py-6 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="px-6 pb-6">
          <p className="text-base font-semibold leading-tight text-sidebar-primary">
            AI Workplace
            <br />
            Productivity Assistant
          </p>
        </div>
        <NavLinks />
      </aside>

      <div className="flex items-center justify-between bg-sidebar px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold text-sidebar-primary">AI Workplace Assistant</p>
        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="bg-sidebar pb-4 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}

      <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
