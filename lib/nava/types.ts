export type AccountType = "personal" | "agency";
export type Platform =
  | "instagram"
  | "tiktok"
  | "threads"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "x"
  | "bluesky"
  | "substack";
export type ConnectionStatus = "connected" | "attention";
export type ContentStatus = "idea" | "draft" | "scheduled" | "published";
export type ApprovalStatus =
  | "not-required"
  | "pending"
  | "approved"
  | "revision-requested";
export type AuditSeverity = "critical" | "high" | "medium";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  accountType: AccountType;
  selectedClientId: string | "all";
}

export interface Client {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  website: string;
  industry: string;
  accent: string;
}

export interface SocialAccount {
  id: string;
  workspaceId: string;
  clientId: string | null;
  platform: Platform;
  handle: string;
  connectionStatus: ConnectionStatus;
  capabilities: string[];
  postsThisWeek: number;
}

export interface ContentVariant {
  id: string;
  platform: Platform;
  caption: string;
  assetType: string;
  cta: string;
}

export interface ContentItem {
  id: string;
  workspaceId: string;
  clientId: string | null;
  title: string;
  summary: string;
  pillar: string;
  objective: string;
  status: ContentStatus;
  approvalStatus: ApprovalStatus;
  scheduledFor: string;
  platformVariants: ContentVariant[];
}

export interface AuditFinding {
  id: string;
  clientId: string | null;
  severity: AuditSeverity;
  title: string;
  evidence: string;
  recommendation: string;
}

export interface InsightKpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "neutral" | "attention";
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  tone: "positive" | "neutral" | "attention";
}

export interface NavaState {
  mode: "demo";
  supabaseConfigured: boolean;
  session: {
    status: "anonymous" | "authenticated";
    onboardingCompleted: boolean;
    currentUser: SessionUser | null;
  };
  workspace: Workspace | null;
  clients: Client[];
  socialAccounts: SocialAccount[];
  contentItems: ContentItem[];
  auditFindings: AuditFinding[];
  insightKpis: InsightKpi[];
  activities: ActivityItem[];
}

export interface OnboardingPayload {
  workspaceName: string;
  workspaceDescription: string;
  firstClientName?: string;
  firstClientIndustry?: string;
  firstClientWebsite?: string;
  platforms: Platform[];
  socialHandle: string;
}

export interface ContentCreateInput {
  title: string;
  summary: string;
  pillar: string;
  objective: string;
  scheduledFor: string;
  platforms: Platform[];
  clientId: string | null;
}
