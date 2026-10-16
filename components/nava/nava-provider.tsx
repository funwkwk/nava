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
  AccountGroup,
  ContentCreateInput,
  ContentItem,
  NavaState,
  OnboardingPayload,
  Platform,
  SessionUser,
  SocialAccount,
  TaskCreateInput,
  WorkspaceTask,
  WorkspaceContact,
  WorkspaceConversation,
} from "@/lib/nava/types";
import { platformCatalog } from "@/lib/nava/navigation";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

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
      ? ({ tasks: [], groups: [], contacts: [], conversations: [], ...JSON.parse(rawState) } as NavaState)
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
  scopedTasks: WorkspaceTask[];
  scopedGroups: AccountGroup[];
  scopedContacts: WorkspaceContact[];
  scopedConversations: WorkspaceConversation[];
  authenticate: (input: {
    email: string;
    name: string;
    accountType: SessionUser["accountType"];
  }) => void;
  completeOnboarding: (payload: OnboardingPayload) => void;
  selectClient: (clientId: string | "all") => void;
  addContentItem: (input: ContentCreateInput) => void;
  updateContentItem: (contentId: string, updates: Partial<Pick<ContentItem, "title" | "summary" | "status" | "approvalStatus" | "scheduledFor" | "platformVariants" | "clientId" | "pillar" | "objective">>) => void;
  removeContentItem: (contentId: string) => void;
  duplicateContentItem: (contentId: string) => void;
  addTask: (input: TaskCreateInput) => void;
  updateTask: (taskId: string, updates: Partial<Pick<WorkspaceTask, "title" | "description" | "clientId" | "relatedPostId" | "assignee" | "priority" | "status" | "dueDate" | "labels" | "comments">>) => void;
  addDemoSocialAccount: (platform: Platform, handle: string, clientId: string | null) => void;
  updateSocialAccountStatus: (accountId: string, status: SocialAccount["connectionStatus"]) => void;
  removeSocialAccount: (accountId: string) => void;
  addGroup: (input: Omit<AccountGroup, "id" | "workspaceId">) => void;
  updateGroup: (groupId: string, updates: Partial<Omit<AccountGroup, "id" | "workspaceId">>) => void;
  removeGroup: (groupId: string) => void;
  addContact: (input: Omit<WorkspaceContact, "id" | "workspaceId">) => void;
  updateContact: (contactId: string, updates: Partial<Omit<WorkspaceContact, "id" | "workspaceId">>) => void;
  removeContact: (contactId: string) => void;
  updateConversation: (conversationId: string, updates: Partial<Omit<WorkspaceConversation, "id" | "workspaceId">>) => void;
  setTheme: (theme: NavaTheme) => void;
  updateProfile: (updates: Partial<Pick<SessionUser, "name" | "avatarUrl">>) => void;
  changeEmail: (newEmail: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  setTwoFactor: (enabled: boolean, secret?: string, backupCodes?: string[]) => void;
  deleteAccount: () => Promise<void>;
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
        status: input.status ?? "draft",
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

  const updateContentItem = useCallback((contentId: string, updates: Partial<Pick<ContentItem, "title" | "summary" | "status" | "approvalStatus" | "scheduledFor" | "platformVariants" | "clientId" | "pillar" | "objective">>) => {
    setState((previousState) => ({ ...previousState, contentItems: previousState.contentItems.map((item) => item.id === contentId ? { ...item, ...updates } : item) }));
  }, []);
  const removeContentItem = useCallback((contentId: string) => {
    setState((previousState) => ({ ...previousState, contentItems: previousState.contentItems.filter((item) => item.id !== contentId) }));
  }, []);
  const duplicateContentItem = useCallback((contentId: string) => setState((previousState) => {
    const item = previousState.contentItems.find((candidate) => candidate.id === contentId);
    if (!item) return previousState;
    const copy: ContentItem = { ...item, id: createId("content"), title: `${item.title} copy`, status: "draft", approvalStatus: "not-required", platformVariants: item.platformVariants.map((variant) => ({ ...variant, id: createId("variant") })) };
    return { ...previousState, contentItems: [copy, ...previousState.contentItems] };
  }), []);

  const addTask = useCallback((input: TaskCreateInput) => {
    setState((previousState) => {
      if (!previousState.workspace) return previousState;
      const task: WorkspaceTask = {
        ...input,
        id: createId("task"),
        workspaceId: previousState.workspace.id,
        comments: [],
      };
      return { ...previousState, tasks: [task, ...(previousState.tasks ?? [])] };
    });
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Pick<WorkspaceTask, "title" | "description" | "clientId" | "relatedPostId" | "assignee" | "priority" | "status" | "dueDate" | "labels" | "comments">>) => {
    setState((previousState) => ({
      ...previousState,
      tasks: (previousState.tasks ?? []).map((task) => task.id === taskId ? { ...task, ...updates } : task),
    }));
  }, []);

  const addDemoSocialAccount = useCallback((platform: Platform, handle: string, clientId: string | null) => {
    setState((previousState) => {
      if (!previousState.workspace) return previousState;
      const catalogEntry = platformCatalog.find((entry) => entry.value === platform);
      const account: SocialAccount = {
        id: createId("social"), workspaceId: previousState.workspace.id, clientId,
        platform, handle: handle.trim().replace(/^@/, ""), connectionStatus: "connected",
        capabilities: catalogEntry?.capabilities ?? [], postsThisWeek: 0, dataSource: "demo",
      };
      return { ...previousState, socialAccounts: [...previousState.socialAccounts, account] };
    });
  }, []);

  const updateSocialAccountStatus = useCallback((accountId: string, status: SocialAccount["connectionStatus"]) => {
    setState((previousState) => ({ ...previousState, socialAccounts: previousState.socialAccounts.map((account) => account.id === accountId ? { ...account, connectionStatus: status } : account) }));
  }, []);

  const removeSocialAccount = useCallback((accountId: string) => {
    setState((previousState) => ({
      ...previousState,
      socialAccounts: previousState.socialAccounts.filter((account) => account.id !== accountId),
      groups: (previousState.groups ?? []).map((group) => ({
        ...group,
        accountIds: group.accountIds.filter((groupAccountId) => groupAccountId !== accountId),
      })),
    }));
  }, []);

  const addGroup = useCallback((input: Omit<AccountGroup, "id" | "workspaceId">) => {
    setState((previousState) => previousState.workspace ? ({ ...previousState, groups: [...(previousState.groups ?? []), { ...input, id: createId("group"), workspaceId: previousState.workspace.id }] }) : previousState);
  }, []);
  const updateGroup = useCallback((groupId: string, updates: Partial<Omit<AccountGroup, "id" | "workspaceId">>) => {
    setState((previousState) => ({ ...previousState, groups: (previousState.groups ?? []).map((group) => group.id === groupId ? { ...group, ...updates } : group) }));
  }, []);
  const removeGroup = useCallback((groupId: string) => {
    setState((previousState) => ({ ...previousState, groups: (previousState.groups ?? []).filter((group) => group.id !== groupId) }));
  }, []);
  const addContact = useCallback((input: Omit<WorkspaceContact, "id" | "workspaceId">) => {
    setState((previousState) => previousState.workspace ? ({ ...previousState, contacts: [...(previousState.contacts ?? []), { ...input, id: createId("contact"), workspaceId: previousState.workspace.id }] }) : previousState);
  }, []);
  const updateContact = useCallback((contactId: string, updates: Partial<Omit<WorkspaceContact, "id" | "workspaceId">>) => {
    setState((previousState) => ({ ...previousState, contacts: (previousState.contacts ?? []).map((contact) => contact.id === contactId ? { ...contact, ...updates } : contact) }));
  }, []);
  const removeContact = useCallback((contactId: string) => {
    setState((previousState) => ({ ...previousState, contacts: (previousState.contacts ?? []).filter((contact) => contact.id !== contactId) }));
  }, []);
  const updateConversation = useCallback((conversationId: string, updates: Partial<Omit<WorkspaceConversation, "id" | "workspaceId">>) => {
    setState((previousState) => ({ ...previousState, conversations: (previousState.conversations ?? []).map((conversation) => conversation.id === conversationId ? { ...conversation, ...updates } : conversation) }));
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<Pick<SessionUser, "name" | "avatarUrl">>) => {
      setState((previousState) => {
        if (!previousState.session.currentUser) {
          return previousState;
        }

        return {
          ...previousState,
          session: {
            ...previousState.session,
            currentUser: {
              ...previousState.session.currentUser,
              ...updates,
            },
          },
        };
      });
    },
    [],
  );

  const changeEmail = useCallback(
    async (newEmail: string): Promise<{ success: boolean; error?: string }> => {
      const normalizedEmail = newEmail.trim().toLowerCase();
      if (!normalizedEmail || !normalizedEmail.includes("@")) {
        return { success: false, error: "Format email tidak valid." };
      }

      const client = getSupabaseBrowserClient();
      if (client) {
        try {
          const { error } = await client.auth.updateUser({ email: normalizedEmail });
          if (error) {
            return { success: false, error: error.message };
          }
        } catch (err) {
          return {
            success: false,
            error: err instanceof Error ? err.message : "Gagal memperbarui email di Supabase.",
          };
        }
      }

      setState((previousState) => {
        if (!previousState.session.currentUser) {
          return previousState;
        }

        return {
          ...previousState,
          session: {
            ...previousState.session,
            currentUser: {
              ...previousState.session.currentUser,
              email: normalizedEmail,
            },
          },
        };
      });

      return { success: true };
    },
    [],
  );

  const changePassword = useCallback(
    async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
      if (!newPassword || newPassword.length < 8) {
        return { success: false, error: "Password minimal harus 8 karakter." };
      }

      const client = getSupabaseBrowserClient();
      if (client) {
        try {
          const { error } = await client.auth.updateUser({ password: newPassword });
          if (error) {
            return { success: false, error: error.message };
          }
        } catch (err) {
          return {
            success: false,
            error: err instanceof Error ? err.message : "Gagal memperbarui password di Supabase.",
          };
        }
      }

      setState((previousState) => {
        if (!previousState.session.currentUser) {
          return previousState;
        }

        return {
          ...previousState,
          session: {
            ...previousState.session,
            currentUser: {
              ...previousState.session.currentUser,
              password: newPassword,
            },
          },
        };
      });

      return { success: true };
    },
    [],
  );

  const setTwoFactor = useCallback(
    (enabled: boolean, secret?: string, backupCodes?: string[]) => {
      setState((previousState) => {
        if (!previousState.session.currentUser) {
          return previousState;
        }

        return {
          ...previousState,
          session: {
            ...previousState.session,
            currentUser: {
              ...previousState.session.currentUser,
              twoFactorEnabled: enabled,
              twoFactorSecret: enabled ? secret : undefined,
              backupCodes: enabled ? backupCodes : undefined,
            },
          },
        };
      });
    },
    [],
  );

  const deleteAccount = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {
        // ignore error during signout
      }
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }

    setState(createEmptyState(supabaseConfigured));
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

  const scopedTasks = useMemo(() => {
    const tasks = state.tasks ?? [];
    if (!state.workspace || state.workspace.selectedClientId === "all") return tasks;
    return tasks.filter((task) => task.clientId === state.workspace?.selectedClientId);
  }, [state.tasks, state.workspace]);
  const scopedGroups = useMemo(() => {
    const groups = state.groups ?? [];
    if (!state.workspace || state.workspace.selectedClientId === "all") return groups;
    return groups.filter((group) => group.clientId === state.workspace?.selectedClientId);
  }, [state.groups, state.workspace]);
  const scopedContacts = useMemo(() => {
    const contacts = state.contacts ?? [];
    if (!state.workspace || state.workspace.selectedClientId === "all") return contacts;
    return contacts.filter((contact) => contact.clientId === state.workspace?.selectedClientId);
  }, [state.contacts, state.workspace]);
  const scopedConversations = useMemo(() => {
    const conversations = state.conversations ?? [];
    if (!state.workspace || state.workspace.selectedClientId === "all") return conversations;
    return conversations.filter((conversation) => conversation.clientId === state.workspace?.selectedClientId);
  }, [state.conversations, state.workspace]);

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
      scopedTasks,
      scopedGroups,
      scopedContacts,
      scopedConversations,
      authenticate,
      completeOnboarding,
      selectClient,
      addContentItem,
      updateContentItem,
      removeContentItem,
      duplicateContentItem,
      addTask,
      updateTask,
      addDemoSocialAccount,
      updateSocialAccountStatus,
      removeSocialAccount,
      addGroup,
      updateGroup,
      removeGroup,
      addContact,
      updateContact,
      removeContact,
      updateConversation,
      setTheme,
      updateProfile,
      changeEmail,
      changePassword,
      setTwoFactor,
      deleteAccount,
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
      scopedTasks,
      scopedGroups,
      scopedContacts,
      scopedConversations,
      authenticate,
      completeOnboarding,
      selectClient,
      addContentItem,
      updateContentItem,
      removeContentItem,
      duplicateContentItem,
      addTask,
      updateTask,
      addDemoSocialAccount,
      updateSocialAccountStatus,
      removeSocialAccount,
      addGroup,
      updateGroup,
      removeGroup,
      addContact,
      updateContact,
      removeContact,
      updateConversation,
      setTheme,
      updateProfile,
      changeEmail,
      changePassword,
      setTwoFactor,
      deleteAccount,
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
