create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  account_type text not null check (account_type in ('personal', 'agency')),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  description text,
  website text,
  industry text,
  created_at timestamptz not null default now()
);

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'threads', 'facebook', 'linkedin', 'youtube')),
  handle text not null,
  connection_status text not null default 'attention' check (connection_status in ('connected', 'attention')),
  capabilities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  title text not null,
  summary text,
  pillar text,
  objective text,
  status text not null default 'draft' check (status in ('idea', 'draft', 'scheduled', 'published')),
  approval_status text not null default 'not-required' check (approval_status in ('not-required', 'pending', 'approved', 'revision-requested')),
  scheduled_for timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.content_variants (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  content_item_id uuid not null references public.content_items (id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'threads', 'facebook', 'linkedin', 'youtube')),
  caption text,
  asset_type text,
  cta text,
  created_at timestamptz not null default now()
);

create table if not exists public.content_targets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  content_item_id uuid not null references public.content_items (id) on delete cascade,
  social_account_id uuid not null references public.social_accounts (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  content_item_id uuid references public.content_items (id) on delete cascade,
  token text not null unique,
  permission text not null check (permission in ('view', 'comment', 'approve')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  content_item_id uuid not null references public.content_items (id) on delete cascade,
  share_link_id uuid references public.share_links (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'revision-requested', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  content_item_id uuid references public.content_items (id) on delete cascade,
  approval_request_id uuid references public.approval_requests (id) on delete cascade,
  author_type text not null check (author_type in ('workspace_owner', 'share_reviewer')),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.approval_decisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  approval_request_id uuid not null references public.approval_requests (id) on delete cascade,
  decision text not null check (decision in ('approved', 'revision-requested')),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  title text not null,
  score numeric(5,2),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_findings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  audit_report_id uuid not null references public.audit_reports (id) on delete cascade,
  severity text not null check (severity in ('critical', 'high', 'medium')),
  evidence text not null,
  recommendation text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_workspace_id on public.clients (workspace_id);
create index if not exists idx_social_accounts_workspace_id on public.social_accounts (workspace_id);
create index if not exists idx_content_items_workspace_id on public.content_items (workspace_id);
create index if not exists idx_content_variants_workspace_id on public.content_variants (workspace_id);
create index if not exists idx_content_targets_workspace_id on public.content_targets (workspace_id);
create index if not exists idx_share_links_workspace_id on public.share_links (workspace_id);
create index if not exists idx_comments_workspace_id on public.comments (workspace_id);
create index if not exists idx_approval_requests_workspace_id on public.approval_requests (workspace_id);
create index if not exists idx_approval_decisions_workspace_id on public.approval_decisions (workspace_id);
create index if not exists idx_audit_reports_workspace_id on public.audit_reports (workspace_id);
create index if not exists idx_audit_findings_workspace_id on public.audit_findings (workspace_id);

create or replace function public.workspace_is_owned(target_workspace_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.workspaces
    where id = target_workspace_id
      and owner_user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.clients enable row level security;
alter table public.social_accounts enable row level security;
alter table public.content_items enable row level security;
alter table public.content_variants enable row level security;
alter table public.content_targets enable row level security;
alter table public.share_links enable row level security;
alter table public.approval_requests enable row level security;
alter table public.comments enable row level security;
alter table public.approval_decisions enable row level security;
alter table public.audit_reports enable row level security;
alter table public.audit_findings enable row level security;

drop policy if exists "profiles own rows" on public.profiles;
create policy "profiles own rows"
on public.profiles
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "workspaces own rows" on public.workspaces;
create policy "workspaces own rows"
on public.workspaces
for all
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

drop policy if exists "clients own workspace" on public.clients;
create policy "clients own workspace"
on public.clients
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "social accounts own workspace" on public.social_accounts;
create policy "social accounts own workspace"
on public.social_accounts
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "content items own workspace" on public.content_items;
create policy "content items own workspace"
on public.content_items
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "content variants own workspace" on public.content_variants;
create policy "content variants own workspace"
on public.content_variants
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "content targets own workspace" on public.content_targets;
create policy "content targets own workspace"
on public.content_targets
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "share links own workspace" on public.share_links;
create policy "share links own workspace"
on public.share_links
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "approval requests own workspace" on public.approval_requests;
create policy "approval requests own workspace"
on public.approval_requests
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "comments own workspace" on public.comments;
create policy "comments own workspace"
on public.comments
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "approval decisions own workspace" on public.approval_decisions;
create policy "approval decisions own workspace"
on public.approval_decisions
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "audit reports own workspace" on public.audit_reports;
create policy "audit reports own workspace"
on public.audit_reports
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));

drop policy if exists "audit findings own workspace" on public.audit_findings;
create policy "audit findings own workspace"
on public.audit_findings
for all
using (public.workspace_is_owned(workspace_id))
with check (public.workspace_is_owned(workspace_id));
