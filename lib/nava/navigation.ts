import type { Platform } from "@/lib/nava/types";

export const workspaceNavigation = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/posts", label: "Posts" },
  { href: "/app/calendar", label: "Calendar" },
  { href: "/app/accounts", label: "Accounts" },
  { href: "/app/groups", label: "Groups" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/inbox", label: "Inbox" },
  { href: "/app/contect", label: "Contacts" },
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
    accent: "#292928",
    capabilities: ["Short-form video", "Insights", "Scheduling"],
  },
  {
    value: "threads",
    label: "Threads",
    shortLabel: "TH",
    accent: "#292928",
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
  {
    value: "x",
    label: "X",
    shortLabel: "X",
    accent: "#292928",
    capabilities: ["Short posts", "Replies"],
  },
  {
    value: "bluesky",
    label: "Bluesky",
    shortLabel: "BS",
    accent: "#1185FE",
    capabilities: ["Short posts", "Replies"],
  },
  {
    value: "substack",
    label: "Substack",
    shortLabel: "SS",
    accent: "#FF6719",
    capabilities: ["Newsletters", "Notes"],
  },
];
