import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Badge, Card, cn } from "@/components/nava/ui";

const featureCards = [
  {
    title: "Workspace-first planning",
    description:
      "Run content, calendar, approval, audit, and insights from one operational workspace instead of juggling separate tools.",
    icon: Workflow,
  },
  {
    title: "Client-safe collaboration",
    description:
      "Keep the product principle client does not equal user. Reviews move through explicit share links and scoped approvals.",
    icon: ShieldCheck,
  },
  {
    title: "Actionable performance loop",
    description:
      "Go from planning to publishing to audit-ready recommendations without turning the workspace into a noisy analytics dashboard.",
    icon: BarChart3,
  },
];

const buildHighlights = [
  "Landing, signup, login, onboarding, and workspace shell",
  "Personal and agency account models with persistent client context",
  "Content, calendar, approval, audit, insight, and settings surfaces",
  "Supabase-ready schema scaffolding with clearly labeled demo mode",
];

export function LandingPage() {
  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-5 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-6 py-5 shadow-[var(--shadow-card)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-brand)] text-lg font-semibold text-white">
              N
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--surface-brand)]">
                Social Media Workspace
              </p>
              <h1 className="text-xl font-semibold">NAVA</h1>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <Link className="hover:text-foreground" href="/login">
              Login
            </Link>
            <Link className="hover:text-foreground" href="/signup">
              Signup
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--surface-brand)] px-4 py-2 font-medium text-white transition hover:bg-[var(--surface-brand-strong)]"
              href="/signup"
            >
              Launch workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="relative overflow-hidden p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,103,234,0.18),transparent_34%)]" />
            <div className="relative space-y-7">
              <div className="space-y-4">
                <Badge tone="brand">First build target ready</Badge>
                <h2 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance lg:text-6xl">
                  Powerful like SocialPilot. Simple like Buffer. Structured like NAVA.
                </h2>
                <p className="max-w-3xl text-base leading-8 text-[var(--muted-foreground)] lg:text-lg">
                  NAVA is an all-in-one workspace for planning, creating, managing, sharing,
                  reviewing, and analyzing social media work. The foundation is built for agency
                  and personal workflows without treating clients as platform users.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Plan → Create → Manage", "Structured workflow"],
                  ["Share → Review", "Client-safe approvals"],
                  ["Analyze → Audit", "Actionable performance loop"],
                ].map(([value, label]) => (
                  <div
                    key={value}
                    className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-card-alt)] p-5"
                  >
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-2xl bg-[var(--surface-brand)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--surface-brand-strong)]",
                  )}
                >
                  Start onboarding
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:bg-[var(--surface-card-alt)]"
                >
                  Open demo workspace
                  <CalendarRange className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>

          <Card className="space-y-6 p-8">
            <div className="space-y-3">
              <Badge tone="brand">What ships in this foundation</Badge>
              <h3 className="text-2xl font-semibold tracking-tight">A credible SaaS starting point</h3>
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                The current build focuses on the first NAVA milestone: account setup, workspace
                ownership, client context, connected social surfaces, content management, and
                calendar planning.
              </p>
            </div>
            <div className="space-y-3">
              {buildHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-[var(--surface-card-alt)] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--surface-brand)]" />
                  <p className="text-sm leading-7 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="space-y-4 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-brand-soft)] text-[var(--surface-brand)]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-5 p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[var(--surface-brand)]" />
              <h3 className="text-xl font-semibold">Built for both account models</h3>
            </div>
            <div className="space-y-4 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>
                <span className="font-semibold text-foreground">Personal:</span> one workspace,
                direct social account ownership, and lightweight operational planning.
              </p>
              <p>
                <span className="font-semibold text-foreground">Agency:</span> one workspace with
                multiple clients, persistent client switching, and a review-ready operating layer.
              </p>
              <p>
                Demo mode stays honest: the product scaffolds Supabase-backed auth and data shapes
                while labeling all seeded content and metrics as demo data until live services are
                connected.
              </p>
            </div>
          </Card>

          <Card className="space-y-6 p-8">
            <div className="space-y-2">
              <Badge tone="brand">Core workflow</Badge>
              <h3 className="text-2xl font-semibold tracking-tight">From signup to scheduled content</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Landing",
                "Signup or Login",
                "Progressive onboarding",
                "Workspace shell",
                "Client setup",
                "Social account connection",
                "Dashboard overview",
                "Content and calendar execution",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card-alt)] px-4 py-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-brand)] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
