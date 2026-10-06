"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Lock, Mail, ShieldCheck } from "@/components/nava/icons";
import { z } from "zod";
import { useNava } from "@/components/nava/nava-provider";
import { Badge, Button, Card, Input, Select } from "@/components/nava/ui";

const authSchema = z.object({
  name: z.string().trim().min(2, "Add a name with at least 2 characters."),
  email: z.email("Enter a valid email address."),
  accountType: z.enum(["personal", "agency"]),
});

const emailOnlySchema = z.object({
  email: z.email("Enter a valid email address."),
});

export function AuthPage({
  mode,
}: {
  mode: "login" | "signup" | "forgot-password" | "reset-password";
}) {
  const router = useRouter();
  const { ready, sessionUser, state, authenticate } = useNava();
  const [form, setForm] = useState({
    name: "",
    email: "",
    accountType: "agency" as "personal" | "agency",
    password: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPasswordHelp = mode === "forgot-password" || mode === "reset-password";

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    if (isPasswordHelp) {
      const result = emailOnlySchema.safeParse({ email: form.email });

      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Check your email address and try again.");
        return;
      }

      setFeedback(
        state.supabaseConfigured
          ? "Live password recovery can be wired into Supabase next. For now the build stays in honest demo mode."
          : "Password recovery is scaffolded, but email delivery stays disabled until Supabase environment variables are connected.",
      );
      return;
    }

    const result = authSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Review the form and try again.");
      return;
    }

    authenticate(result.data);
    router.push("/onboarding");
  }

  const titles = {
    login: "Enter your workspace",
    signup: "Create your NAVA account",
    "forgot-password": "Recover access",
    "reset-password": "Reset password",
  };

  const descriptions = {
    login:
      "Use the shared auth entry point for personal and agency flows. In this foundation build, login continues through clearly labeled demo mode.",
    signup:
      "Choose the account model once, then move into progressive onboarding without forcing unnecessary setup upfront.",
    "forgot-password":
      "Password recovery is included in the route structure and product architecture. Live delivery is intentionally not faked.",
    "reset-password":
      "Reset flows are reserved for the Supabase integration path and remain transparent in demo mode.",
  };

  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="flex flex-col justify-between gap-8 bg-[var(--surface-sidebar)] text-white">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-white/10 text-white" tone="neutral">
                Shared authentication
              </Badge>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
                  {titles[mode]}
                </h1>
                <p className="max-w-xl text-sm leading-7 text-slate-300">{descriptions[mode]}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                {
                  icon: Mail,
                  title: "Single auth system",
                  description: "Personal and agency users share one login surface.",
                },
                {
                  icon: ShieldCheck,
                  title: "Workspace-backed authorization",
                  description: "Authorization is designed to stay database-backed and RLS-aware.",
                },
                {
                  icon: Lock,
                  title: "Honest demo mode",
                  description:
                    "Live email/password flows are prepared for Supabase, while the local experience remains clearly labeled.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            {state.supabaseConfigured
              ? "Supabase environment variables are present, so the project is ready for live auth wiring next."
              : "No Supabase environment variables were found, so auth intentionally boots into demo mode rather than pretending live auth is connected."}
          </div>
        </Card>

        <Card className="p-8 lg:p-10">
          {!ready ? (
            <div className="space-y-4">
              <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge tone="brand">{state.supabaseConfigured ? "Supabase-ready" : "Demo mode"}</Badge>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {mode === "signup" ? "Start with a workspace model" : "Continue with your workspace"}
                  </h2>
                  <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                    {sessionUser
                      ? `You are signed in locally as ${sessionUser.name}.`
                      : "The current build uses local demo state until live auth and persistence are connected."}
                  </p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === "signup" ? (
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                  />
                ) : null}

                <Input
                  placeholder="Email address"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />

                {mode === "login" || mode === "signup" ? (
                  <Select
                    value={form.accountType}
                    onChange={(event) =>
                      updateField("accountType", event.target.value as "personal" | "agency")
                    }
                  >
                    <option value="agency">Agency workspace</option>
                    <option value="personal">Personal workspace</option>
                  </Select>
                ) : null}

                {mode !== "forgot-password" ? (
                  <Input
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                  />
                ) : null}

                {error ? <p className="text-sm text-rose-600">{error}</p> : null}
                {feedback ? <p className="text-sm text-[var(--surface-brand)]">{feedback}</p> : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button fullWidth type="submit">
                    {mode === "signup"
                      ? "Continue to onboarding"
                      : mode === "login"
                        ? "Enter demo workspace"
                        : "Check recovery setup"}
                  </Button>
                  <Button
                    fullWidth
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/app")}
                  >
                    View workspace shell
                  </Button>
                </div>
              </form>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
                {mode === "login" ? (
                  <>
                    <Link className="hover:text-foreground" href="/signup">
                      Need an account? Sign up
                    </Link>
                    <Link className="hover:text-foreground" href="/forgot-password">
                      Forgot password
                    </Link>
                  </>
                ) : mode === "signup" ? (
                  <Link className="hover:text-foreground" href="/login">
                    Already have access? Login
                  </Link>
                ) : (
                  <Link className="hover:text-foreground" href="/login">
                    Back to login
                  </Link>
                )}
              </div>

              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-card-alt)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Current flow</p>
                    <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">
                      Landing → Signup/Login → Onboarding → Workspace → Content → Calendar
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-[var(--surface-brand)]" />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
