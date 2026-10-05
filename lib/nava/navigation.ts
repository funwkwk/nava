import type { Platform } from "@/lib/nava/types";

export const workspaceNavigation = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/posts", label: "Posts" },
  { href: "/app/calendar", label: "Calender" },
  { href: "/app/accounts", label: "Accounts" },
  { href: "/app/groups", label: "Groups" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/inbox", label: "Inbox" },
  { href: "/app/contect", label: "Contect" },
];

export const settingsNavigation = { href: "/app/settings", label: "Settings" };

export const platformCatalog: Array<{
  value: Platform;
  label: string;
  shortLabel: string;
  accent: string;
  capabilities: string[];
}> = [
  {
    value: "instagram",
    label: "Instagram",
    shortLabel: "IG",
    accent: "#DD2A7B",
    capabilities: ["Publishing", "Comments", "Insights"],
  },
  {
    value: "tiktok",
    label: "TikTok",
    shortLabel: "TT",
    accent: "#101010",
    capabilities: ["Short-form video", "Insights", "Scheduling"],
  },
  {
    value: "threads",
    label: "Threads",
    shortLabel: "TH",
    accent: "#0f172a",
    capabilities: ["Text-first publishing", "Reply monitoring"],
  },
  {
    value: "facebook",
    label: "Facebook",
    shortLabel: "FB",
    accent: "#1877F2",
    capabilities: ["Publishing", "Inbox", "Analytics"],
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    shortLabel: "LI",
    accent: "#0A66C2",
    capabilities: ["B2B publishing", "Thought leadership"],
  },
  {
    value: "youtube",
    label: "YouTube",
    shortLabel: "YT",
    accent: "#FF0000",
    capabilities: ["Video publishing", "Channel performance"],
  },
];
