"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckCircle2 } from "@/components/nava/icons";
import { z } from "zod";
import { useNava } from "@/components/nava/nava-provider";
import { Badge, Button, Card, Input, SectionHeading, Textarea, cn } from "@/components/nava/ui";
import { platformCatalog } from "@/lib/nava/navigation";
import type { Platform } from "@/lib/nava/types";

export function OnboardingPage() {
  const router = useRouter();
  const { ready, sessionUser, completeOnboarding } = useNava();
  const accountType = sessionUser?.accountType ?? "agency";
  const platformValues = useMemo(
    () => platformCatalog.map((item) => item.value) as [Platform, ...Platform[]],
    [],
  );
  const onboardingSchema = useMemo(
    () =>
      z
        .object({
          workspaceName: z.string().trim().min(2, "Add a workspace name."),
          workspaceDescription: z
            .string()
            .trim()
            .min(12, "Describe the workspace in at least 12 characters."),
          firstClientName: z.string().trim().optional(),
          firstClientIndustry: z.string().trim().optional(),
          firstClientWebsite: z.string().trim().optional(),
          platforms: z.array(z.enum(platformValues)).min(1, "Choose at least one platform."),
          socialHandle: z.string().trim().min(2, "Add the first connected handle."),
        })
        .superRefine((value, context) => {
          if (accountType === "agency" && !value.firstClientName?.trim()) {
            context.addIssue({
              code: "custom",
              path: ["firstClientName"],
              message: "Add the first client or brand name.",
            });
          }
        }),
    [accountType, platformValues],
  );

  const [form, setForm] = useState({
    workspaceName: accountType === "agency" ? "NAVA Agency Workspace" : "NAVA Personal Workspace",
    workspaceDescription:
      accountType === "agency"
        ? "A premium social operations workspace for managing clients, content, reviews, and reporting."
        : "A focused workspace for planning, creating, and improving a personal social publishing system.",
    firstClientName: accountType === "agency" ? "Solstice Studio" : "",
    firstClientIndustry: accountType === "agency" ? "Lifestyle" : "",
    firstClientWebsite: accountType === "agency" ? "https://solsticestudio.demo" : "",
    socialHandle: accountType === "agency" ? "@solsticestudio" : "@navacreator",
    platforms: ["instagram", "threads"] as Array<(typeof platformCatalog)[number]["value"]>,
  });
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function togglePlatform(platform: (typeof platformCatalog)[number]["value"]) {
    setForm((previous) => {
      const exists = previous.platforms.includes(platform);

      return {
        ...previous,
        platforms: exists
          ? previous.platforms.filter((value) => value !== platform)
          : [...previous.platforms, platform],
      };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = onboardingSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Review the onboarding details and try again.");
      return;
    }

    completeOnboarding({
      ...result.data,
      platforms: result.data.platforms as Platform[],
    });
    router.push("/app");
  }

  if (!ready) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-8 lg:px-10">
        <Card className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-32 animate-pulse rounded-[28px] bg-slate-200" />
        </Card>
      </main>
    );
  }

  if (!sessionUser) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-8 lg:px-10">
        <Card className="space-y-5 text-center">
          <Badge tone="warning">Authentication required</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Start with signup or login</h1>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              Onboarding needs an authenticated workspace owner, even in demo mode.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={() => router.push("/signup")}>Go to signup</Button>
            <Button variant="secondary" onClick={() => router.push("/login")}>
              Go to login
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const steps =
    accountType === "agency"
      ? [
          "Choose Agency",
          "Name the workspace",
          "Create the first client",
          "Connect the first social account",
          "Enter the workspace",
        ]
      : [
          "Choose Personal",
          "Name the workspace",
          "Connect the first social account",
          "Enter the workspace",
        ];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="space-y-6 bg-[var(--surface-sidebar)] text-white">
          <div className="space-y-3">
            <Badge className="bg-white/10 text-white" tone="neutral">
              Progressive onboarding
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight">
              Configure {accountType === "agency" ? "your agency workspace" : "your personal workspace"}
            </h1>
            <p className="text-sm leading-7 text-slate-300">
              Keep setup short, ownership-first, and focused on the first social workflow. Extra
              configuration can wait until after the workspace is live.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-[22px] bg-white/5 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-8 p-8 lg:p-10">
          <SectionHeading
            eyebrow="Workspace setup"
            title="Prepare the first working NAVA build"
            description="Create the core tenant context, optionally add the first client, then connect the first account so the dashboard, content, and calendar have real operating context."
          />

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Workspace</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Workspace name"
                  value={form.workspaceName}
                  onChange={(event) => updateField("workspaceName", event.target.value)}
                />
                <Input value={sessionUser.email} disabled />
              </div>
              <Textarea
                placeholder="Describe the workspace"
                value={form.workspaceDescription}
                onChange={(event) => updateField("workspaceDescription", event.target.value)}
              />
            </div>

            {accountType === "agency" ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">First client / brand</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Client name"
                    value={form.firstClientName}
                    onChange={(event) => updateField("firstClientName", event.target.value)}
                  />
                  <Input
                    placeholder="Industry"
                    value={form.firstClientIndustry}
                    onChange={(event) => updateField("firstClientIndustry", event.target.value)}
                  />
                </div>
                <Input
                  placeholder="Website"
                  value={form.firstClientWebsite}
                  onChange={(event) => updateField("firstClientWebsite", event.target.value)}
                />
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Connect social account</h2>
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                  Pick the first platforms to seed the workspace. Demo mode marks these as mock
                  connections until provider credentials are added.
                </p>
              </div>
              <Input
                placeholder="Primary handle"
                value={form.socialHandle}
                onChange={(event) => updateField("socialHandle", event.target.value)}
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {platformCatalog.map((platform) => {
                  const active = form.platforms.includes(platform.value);

                  return (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => togglePlatform(platform.value)}
                      className={cn(
                        "rounded-[24px] border p-5 text-left transition",
                        active
                          ? "border-[var(--surface-brand)] bg-[var(--surface-brand-soft)]"
                          : "border-[var(--border-subtle)] bg-[var(--surface-card-alt)] hover:border-[var(--border-strong)]",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold">{platform.label}</p>
                          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                            {platform.capabilities.join(" • ")}
                          </p>
                        </div>
                        {active ? (
                          <CheckCircle2 className="h-5 w-5 text-[var(--surface-brand)]" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit">Enter workspace</Button>
              <Button type="button" variant="secondary" onClick={() => router.push("/app")}>
                Preview shell first
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
