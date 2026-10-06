"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { FormEvent, ReactNode } from "react";
import { z } from "zod";
import {
  AtSign,
  CalendarRange,
  ChevronDown,
  CloudUpload,
  Dropbox,
  Facebook,
  FileText,
  GoogleDrive,
  Microsoft,
  Palette,
  Plus,
  X,
  Hash,
  Heart,
  ImagePlus,
  Instagram,
  Linkedin,
  MessageCircle,
  Send,
  Smile,
  Sparkles,
  Threads,
  Tiktok,
  Youtube,
} from "@/components/nava/icons";
import { useNava } from "@/components/nava/nava-provider";
import { DateTimePicker, toLocalValue } from "@/components/nava/date-time-picker";
import { Textarea, cn } from "@/components/nava/ui";
import type { Platform } from "@/lib/nava/types";

const platforms: Array<{
  value: Platform;
  label: string;
  Icon: typeof Instagram;
  color: string;
}> = [
  { value: "instagram", label: "Instagram", Icon: Instagram, color: "#DD2A7B" },
  { value: "facebook", label: "Facebook", Icon: Facebook, color: "#2F6BFF" },
  { value: "tiktok", label: "TikTok", Icon: Tiktok, color: "#292928" },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin, color: "#3A66AE" },
  { value: "youtube", label: "YouTube", Icon: Youtube, color: "#EE3124" },
  { value: "threads", label: "Threads", Icon: Threads, color: "#292928" },
];

const schema = z.object({
  summary: z.string().trim().min(12, "Write a caption of at least 12 characters."),
  scheduledFor: z.string().trim().min(1, "Set a publish date."),
  clientId: z.string().optional(),
  platforms: z.array(z.string()).min(1, "Pick at least one account."),
});

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-5">
      <h2 className="mb-3 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

const driveProviders = [
  { name: "Google Drive", Icon: GoogleDrive },
  { name: "Dropbox", Icon: Dropbox },
  { name: "OneDrive", Icon: Microsoft },
  { name: "Canva", Icon: Palette },
  { name: "Unsplash", Icon: ImagePlus },
];

const acceptedTypes = "image/*,video/*,application/pdf";

type MediaFile = { id: string; file: File; url: string };

function useDismiss<T extends HTMLElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);

  return ref;
}

function GroupsButton() {
  const [open, setOpen] = useState(false);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative mt-auto pt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="flex h-10 w-full items-center justify-center rounded-lg bg-[var(--surface-card-alt)] text-sm font-medium hover:brightness-95"
      >
        Groups
      </button>
      {open ? (
        <div className="absolute bottom-full left-0 z-30 mb-2 w-full rounded-2xl bg-white p-3 text-sm text-[var(--muted-foreground)] shadow-[0_12px_32px_rgba(41,41,40,0.16)]">
          No groups yet.
        </div>
      ) : null}
    </div>
  );
}

export function CreatePostPage() {
  const router = useRouter();
  const { addContentItem, sessionUser, workspace } = useNava();
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [driveOpen, setDriveOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const driveRef = useDismiss<HTMLDivElement>(driveOpen, () => setDriveOpen(false));
  const mediaRef = useRef<MediaFile[]>([]);
  const [form, setForm] = useState({
    summary: "",
    scheduledFor: "2026-10-09T09:00",
    clientId: "",
    platforms: ["instagram"] as string[],
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  useEffect(
    () => () => mediaRef.current.forEach((item) => URL.revokeObjectURL(item.url)),
    [],
  );

  if (!sessionUser || !workspace) {
    return null;
  }

  function addFiles(files: FileList | File[]) {
    const accepted = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/") || file.type === "application/pdf",
    );

    if (accepted.length !== Array.from(files).length) {
      setNotice("Only images, videos, and PDF files can be uploaded.");
    } else {
      setNotice(null);
    }

    setMedia((previous) => [
      ...previous,
      ...accepted.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeFile(id: string) {
    setMedia((previous) => {
      const target = previous.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return previous.filter((item) => item.id !== id);
    });
  }

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function toggle(platform: string) {
    setForm((previous) => ({
      ...previous,
      platforms: previous.platforms.includes(platform)
        ? previous.platforms.filter((entry) => entry !== platform)
        : [...previous.platforms, platform],
    }));
  }

  function publish(scheduledFor: string) {
    const result = schema.safeParse({ ...form, scheduledFor });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Review the post and try again.");
      return;
    }

    const title = result.data.summary.split("\n")[0].slice(0, 60);

    addContentItem({
      ...result.data,
      title,
      pillar: "Education",
      objective: "Engagement",
      clientId: result.data.clientId || null,
      platforms: result.data.platforms as Platform[],
      scheduledFor: new Date(result.data.scheduledFor).toISOString(),
    });
    router.push("/app/posts");
  }

  function nextSlot() {
    const slot = new Date();
    slot.setHours(slot.getHours() + 1, 0, 0, 0);
    return toLocalValue(slot);
  }

  const selected = platforms.filter((platform) => form.platforms.includes(platform.value));
  const softField = "rounded-xl border-0 bg-[var(--surface-card-alt)]";

  return (
    <form
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        publish(form.scheduledFor);
      }}
      className="grid gap-4 lg:h-[calc(100vh-2rem)] lg:grid-cols-[260px_minmax(0,1fr)_320px]"
    >
      <aside className="flex flex-col rounded-[24px] bg-white p-5">
        <h2 className="mb-3 text-base font-semibold">Accounts</h2>
        <div className="mb-4">
          <DateTimePicker value={form.scheduledFor} onChange={(value) => update("scheduledFor", value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {platforms.map(({ value, label, Icon, color }) => {
            const active = form.platforms.includes(value);
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                aria-label={label}
                title={label}
                onClick={() => toggle(value)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl border transition",
                  active
                    ? "border-transparent text-white"
                    : "border-[#dcdcdc] bg-white text-[#5a5a5a] hover:bg-[var(--surface-card-alt)]",
                )}
                style={active ? { background: color } : undefined}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
        <GroupsButton />
      </aside>

      <div className="flex min-h-0 flex-col gap-4">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
          <Panel title="Media">
            <input
              ref={fileInput}
              type="file"
              multiple
              accept={acceptedTypes}
              onChange={onPick}
              className="hidden"
            />
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "flex h-48 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-center text-sm text-[var(--muted-foreground)] transition",
                dragging ? "border-[var(--surface-brand)] bg-[var(--surface-brand-soft)]" : "border-[#d6d3cc] bg-[var(--surface-card-alt)]",
              )}
            >
              <CloudUpload className="h-5 w-5" />
              <span>
                Drag and drop or{" "}
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="text-[var(--surface-brand)]"
                >
                  Upload a file
                </button>
              </span>
              <span>PNG, JPG, GIF, WEBP, MP4, MOV, WEBM and PDF.</span>
            </div>

            {media.length ? (
              <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {media.map((item) => (
                  <li key={item.id} className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--surface-card-alt)]">
                    {item.file.type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.file.name} className="h-full w-full object-cover" />
                    ) : item.file.type.startsWith("video/") ? (
                      <video src={item.url} muted className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center text-[var(--muted-foreground)]">
                        <FileText className="h-6 w-6" />
                        <span className="w-full truncate text-xs">{item.file.name}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove ${item.file.name}`}
                      onClick={() => removeFile(item.id)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#292928]/70 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {notice ? <p role="status" className="mt-2 text-sm text-[var(--muted-foreground)]">{notice}</p> : null}

            <div className="mt-3 flex items-center gap-1 text-[var(--muted-foreground)]">
              <button
                type="button"
                aria-label="Upload image"
                title="Upload image"
                onClick={() => fileInput.current?.click()}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--surface-card-alt)]"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <div ref={driveRef} className="relative">
                <button
                  type="button"
                  aria-label="Connect a drive"
                  aria-expanded={driveOpen}
                  onClick={() => setDriveOpen((previous) => !previous)}
                  className="flex h-9 items-center gap-1.5 rounded-lg px-2 hover:bg-[var(--surface-card-alt)]"
                >
                  <Plus className="h-4 w-4" />
                  <ChevronDown className={cn("h-3 w-3 transition", driveOpen && "rotate-180")} />
                </button>
                {driveOpen ? (
                  <ul className="absolute left-0 top-full z-30 mt-2 w-56 rounded-2xl bg-white p-1.5 shadow-[0_12px_32px_rgba(41,41,40,0.16)]">
                    {driveProviders.map(({ name, Icon }) => (
                      <li key={name}>
                        <button
                          type="button"
                          onClick={() => {
                            setDriveOpen(false);
                            setNotice(`Connecting to ${name} is not available yet.`);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-[var(--surface-card-alt)]"
                        >
                          <Icon className="h-4 w-4" />
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </Panel>

          <Panel title="Caption">
            <Textarea
              placeholder="Write your caption, then customize it for each social network"
              value={form.summary}
              onChange={(event) => update("summary", event.target.value)}
              className={cn(softField, "min-h-48")}
            />
            <div className="mt-3 flex items-center justify-between text-[var(--muted-foreground)]">
              <div className="flex items-center gap-3">
                <Smile className="h-4 w-4" />
                <AtSign className="h-4 w-4" />
                <Hash className="h-4 w-4" />
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-xs">{form.summary.length}</span>
            </div>
          </Panel>
          {error ? <p role="alert" className="px-2 text-sm text-rose-600">{error}</p> : null}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 rounded-[24px] bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => publish(form.scheduledFor)}
            className="inline-flex h-9 items-center rounded-xl px-3 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)]"
          >
            Schedule Draft
          </button>
          <div ref={menuRef} className="relative flex">
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-l-xl bg-[var(--surface-brand)] px-4 text-sm font-medium text-white hover:bg-[var(--surface-brand-strong)]"
            >
              <CalendarRange className="h-4 w-4" /> Schedule Post
            </button>
            <button
              type="button"
              aria-label="More publish options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((previous) => !previous)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-r-xl border-l border-white/30 bg-[var(--surface-brand)] text-white hover:bg-[var(--surface-brand-strong)]"
            >
              <ChevronDown className={cn("h-4 w-4 transition", menuOpen && "rotate-180")} />
            </button>
            {menuOpen ? (
              <ul className="absolute bottom-full right-0 z-30 mb-2 w-44 rounded-2xl bg-white p-1.5 shadow-[0_12px_32px_rgba(41,41,40,0.16)]">
                <li>
                  <button
                    type="button"
                    onClick={() => publish(toLocalValue(new Date()))}
                    className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-card-alt)]"
                  >
                    <Send className="mr-2 h-4 w-4" /> Share Now
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => publish(nextSlot())}
                    className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-card-alt)]"
                  >
                    <Send className="mr-2 h-4 w-4" /> Share Next
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
        </footer>
      </div>

      <aside className="overflow-y-auto rounded-[24px] bg-white p-5">
        <h2 className="mb-3 text-base font-semibold">Preview</h2>
        {selected.length ? (
          <div className="space-y-3">
            {selected.map(({ value, label, Icon, color }) => (
              <div key={value} className="rounded-xl bg-[var(--surface-card-alt)] p-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                    style={{ background: color }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Now</p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-xs">
                  {form.summary || "Your caption preview appears here."}
                </p>
                <div className="mt-3 flex gap-4 text-xs text-[var(--muted-foreground)]">
                  <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> Like</span>
                  <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> Comment</span>
                  <span className="inline-flex items-center gap-1"><Send className="h-3 w-3" /> Send</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--muted-foreground)]">Select an account to see its preview.</p>
        )}
      </aside>
    </form>
  );
}
