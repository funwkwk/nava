"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createEmptyState, createSeedStateFromOnboarding } from "@/lib/nava/demo-state";
import type {
  Client,
  ContentCreateInput,
  ContentItem,
  NavaState,
  OnboardingPayload,
  Platform,
  SessionUser,
  SocialAccount,
} from "@/lib/nava/types";
import { platformCatalog } from "@/lib/nava/navigation";
import { supabaseConfigured } from "@/lib/supabase/env";

const STORAGE_KEY = "nava-demo-state-v1";
const THEME_STORAGE_KEY = "nava-theme-v1";
const emptySubscribe = () => () => undefined;
type NavaTheme = "light" | "dark";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function readStoredState() {
  if (typeof window === "undefined") {
    return createEmptyState(supabaseConfigured);
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    return rawState
      ? (JSON.parse(rawState) as NavaState)
      : createEmptyState(supabaseConfigured);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return createEmptyState(supabaseConfigured);
  }
}

function readStoredTheme(): NavaTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  return storedTheme === "dark" ? "dark" : "light";
}

function buildContentVariants(platforms: Platform[], title: string, objective: string) {
  return platforms.map((platform) => {
    const label = platformCatalog.find((entry) => entry.value === platform)?.label ?? platform;

    return {
      id: createId("variant"),
      platform,
      caption: `${title} for ${label}: open with one clear audience problem and end with a ${objective.toLowerCase()} CTA.`,
      assetType:
        platform === "tiktok" || platform === "youtube" ? "Short-form video" : "Static + caption",
      cta: objective === "Traffic" ? "Visit the site" : "Save this post",
    };
  });
}

interface NavaContextValue {
  ready: boolean;
  state: NavaState;
  theme: NavaTheme;
  sessionUser: SessionUser | null;
  workspace: NavaState["workspace"];
  selectedClient: Client | null;
  scopedContentItems: ContentItem[];
  scopedAuditFindings: NavaState["auditFindings"];
  scopedSocialAccounts: SocialAccount[];
  authenticate: (input: {
    email: string;
    name: string;
    accountType: SessionUser["accountType"];
  }) => void;
  completeOnboarding: (payload: OnboardingPayload) => void;
  selectClient: (clientId: string | "all") => void;
  addContentItem: (input: ContentCreateInput) => void;
  setTheme: (theme: NavaTheme) => void;
  logout: () => void;
  resetDemo: () => void;
}

const NavaContext = createContext<NavaContextValue | null>(null);

export function NavaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavaState>(() => readStoredState());
  const [theme, setTheme] = useState<NavaTheme>(() => readStoredTheme());
  const ready = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [ready, theme]);

  const authenticate = useCallback(
    ({
      email,
      name,
      accountType,
    }: {
      email: string;
      name: string;
      accountType: SessionUser["accountType"];
    }) => {
      const normalizedName =
        name.trim() ||
        email
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (match) => match.toUpperCase());

      setState((previousState) => ({
        ...createEmptyState(previousState.supabaseConfigured),
        session: {
          status: "authenticated",
          onboardingCompleted: false,
          currentUser: {
            id: createId("user"),
            name: normalizedName,
            email,
            accountType,
          },
        },
      }));
    },
    [],
  );

  const completeOnboarding = useCallback((payload: OnboardingPayload) => {
    setState((previousState) => {
      if (!previousState.session.currentUser) {
        return previousState;
      }

      return createSeedStateFromOnboarding(
        previousState.session.currentUser,
        payload,
        previousState.supabaseConfigured,
      );
    });
  }, []);

  const selectClient = useCallback((clientId: string | "all") => {
    setState((previousState) => {
      if (!previousState.workspace) {
        return previousState;
      }

      return {
        ...previousState,
        workspace: {
          ...previousState.workspace,
          selectedClientId: clientId,
        },
      };
    });
  }, []);

  const addContentItem = useCallback((input: ContentCreateInput) => {
    setState((previousState) => {
      if (!previousState.workspace || !previousState.session.currentUser) {
        return previousState;
      }

      const fallbackClientId =
        previousState.session.currentUser.accountType === "agency" &&
        previousState.workspace.selectedClientId !== "all"
          ? previousState.workspace.selectedClientId
          : previousState.clients[0]?.id ?? null;

      const newItem: ContentItem = {
        id: createId("content"),
        workspaceId: previousState.workspace.id,
        clientId:
          previousState.session.currentUser.accountType === "agency"
            ? input.clientId ?? fallbackClientId
            : null,
        title: input.title,
        summary: input.summary,
        pillar: input.pillar,
        objective: input.objective,
        status: "draft",
        approvalStatus:
          previousState.session.currentUser.accountType === "agency"
            ? "pending"
            : "not-required",
        scheduledFor: input.scheduledFor,
        platformVariants: buildContentVariants(input.platforms, input.title, input.objective),
      };

      return {
        ...previousState,
        contentItems: [newItem, ...previousState.contentItems],
      };
    });
  }, []);

  const logout = useCallback(() => {
    setState((previousState) => createEmptyState(previousState.supabaseConfigured));
  }, []);

  const resetDemo = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(createEmptyState(supabaseConfigured));
  }, []);

  const selectedClient = useMemo(() => {
    if (!state.workspace || state.workspace.selectedClientId === "all") {
      return null;
    }

    return state.clients.find((client) => client.id === state.workspace?.selectedClientId) ?? null;
  }, [state.clients, state.workspace]);

  const scopedContentItems = useMemo(() => {
    if (!state.workspace || state.workspace.selectedClientId === "all") {
      return state.contentItems;
    }

    return state.contentItems.filter((item) => item.clientId === state.workspace?.selectedClientId);
  }, [state.contentItems, state.workspace]);

  const scopedAuditFindings = useMemo(() => {
    if (!state.workspace || state.workspace.selectedClientId === "all") {
      return state.auditFindings;
    }

    return state.auditFindings.filter(
      (finding) => finding.clientId === state.workspace?.selectedClientId,
    );
  }, [state.auditFindings, state.workspace]);

  const scopedSocialAccounts = useMemo(() => {
    if (!state.workspace || state.workspace.selectedClientId === "all") {
      return state.socialAccounts;
    }

    return state.socialAccounts.filter(
      (account) => account.clientId === state.workspace?.selectedClientId,
    );
  }, [state.socialAccounts, state.workspace]);

  const value = useMemo<NavaContextValue>(
    () => ({
      ready,
      state,
      theme,
      sessionUser: state.session.currentUser,
      workspace: state.workspace,
      selectedClient,
      scopedContentItems,
      scopedAuditFindings,
      scopedSocialAccounts,
      authenticate,
      completeOnboarding,
      selectClient,
      addContentItem,
      setTheme,
      logout,
      resetDemo,
    }),
    [
      ready,
      state,
      theme,
      selectedClient,
      scopedContentItems,
      scopedAuditFindings,
      scopedSocialAccounts,
      authenticate,
      completeOnboarding,
      selectClient,
      addContentItem,
      setTheme,
      logout,
      resetDemo,
    ],
  );

  return <NavaContext.Provider value={value}>{children}</NavaContext.Provider>;
}

export function useNava() {
  const context = useContext(NavaContext);

  if (!context) {
    throw new Error("useNava must be used inside NavaProvider.");
  }

  return context;
}
