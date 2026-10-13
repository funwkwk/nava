"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ChangeEvent, DragEvent } from "react";
import type { FormEvent, ReactNode } from "react";
import { z } from "zod";
import {
  ArrowUpRight,
  AtSign,
  CalendarRange,
  ChevronDown,
  CloudUpload,
  Dropbox,
  Facebook,
  FileText,
  GoogleDrive,
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
  Clock3,
  Tag,
  Threads,
  XTwitter,
  Bluesky,
  Substack,
  Tiktok,
  Youtube,
} from "@/components/nava/icons";
import { useNava } from "@/components/nava/nava-provider";
import { DateTimePicker, toLocalValue } from "@/components/nava/date-time-picker";
import { Textarea, cn } from "@/components/nava/ui";
import type { ContentStatus, Platform } from "@/lib/nava/types";

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
  { value: "x", label: "X", Icon: XTwitter, color: "#292928" },
  { value: "bluesky", label: "Bluesky", Icon: Bluesky, color: "#1185FE" },
  { value: "substack", label: "Substack", Icon: Substack, color: "#FF6719" },
];

function NoPreviewIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 230 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#clip0_939_25445)">
        <rect x="42.2002" y="42.4102" width="151.248" height="191.138" rx="7.18392" fill="transparent" />
        <rect x="42" y="87" width="151" height="147" fill="var(--color-illustration-element)" />
      </g>
      <rect x="42.7002" y="42.9102" width="150.248" height="190.138" rx="6.68392" stroke="var(--color-illustration-border)" />
      <path d="M15.14 234.731C14.816 234.829 14.5636 235.084 14.4693 235.409L13.2329 239.67C12.9539 240.632 11.5912 240.632 11.3122 239.67L10.0758 235.409C9.9815 235.084 9.72908 234.829 9.40505 234.731L5.16352 233.447C4.21633 233.161 4.21633 231.82 5.16352 231.533L9.40505 230.25C9.72908 230.152 9.9815 229.896 10.0758 229.571L11.3122 225.31C11.5912 224.348 12.9539 224.348 13.2329 225.31L14.4693 229.571C14.5636 229.896 14.816 230.152 15.14 230.25L19.3816 231.533C20.3288 231.82 20.3288 233.161 19.3816 233.447L15.14 234.731ZM25.9365 240.008C26.2406 240.178 26.6118 240.178 26.9159 240.008L29.2924 238.673C30.1654 238.183 31.1373 239.137 30.6625 240.019L29.323 242.506C29.1636 242.802 29.1636 243.158 29.323 243.454L30.6625 245.941C31.1373 246.823 30.1654 247.778 29.2924 247.287L26.9159 245.953C26.6118 245.782 26.2406 245.782 25.9365 245.953L23.56 247.287C22.687 247.778 21.7151 246.823 22.1899 245.941L23.5293 243.454C23.6888 243.158 23.6888 242.802 23.5293 242.506L22.1899 240.019C21.7151 239.137 22.687 238.183 23.56 238.673L25.9365 240.008ZM12.8391 245.381C13.7173 244.872 14.7067 245.844 14.2144 246.731L13.7435 247.58C13.576 247.882 13.576 248.249 13.7435 248.55L14.2144 249.399C14.7067 250.286 13.7173 251.258 12.8391 250.75L12.0673 250.303C11.7575 250.124 11.3755 250.124 11.0656 250.303L10.2939 250.75C9.41564 251.258 8.42627 250.286 8.91859 249.399L9.38952 248.55C9.55699 248.249 9.55699 247.882 9.38952 247.58L8.9186 246.731C8.42628 245.844 9.41564 244.872 10.2939 245.381L11.0656 245.827C11.3755 246.007 11.7575 246.007 12.0673 245.827L12.8391 245.381Z" fill="var(--color-illustration-element)" />
      <path d="M207.156 30.8304C207.48 30.7323 207.733 30.477 207.827 30.1519L209.063 25.8908C209.342 24.929 210.705 24.929 210.984 25.8908L212.22 30.1519C212.315 30.477 212.567 30.7323 212.891 30.8304L217.133 32.1137C218.08 32.4003 218.08 33.7414 217.133 34.028L212.891 35.3114C212.567 35.4095 212.315 35.6648 212.22 35.9899L210.984 40.2509C210.705 41.2127 209.342 41.2127 209.063 40.2509L207.827 35.9899C207.733 35.6648 207.48 35.4095 207.156 35.3114L202.915 34.028C201.967 33.7414 201.967 32.4003 202.915 32.1137L207.156 30.8304ZM196.36 25.5533C196.055 25.3825 195.684 25.3825 195.38 25.5533L193.004 26.8881C192.131 27.3784 191.159 26.4236 191.634 25.542L192.973 23.055C193.132 22.759 193.132 22.4026 192.973 22.1066L191.634 19.6196C191.159 18.738 192.131 17.7832 193.004 18.2736L195.38 19.6083C195.684 19.7791 196.055 19.7791 196.36 19.6083L198.736 18.2736C199.609 17.7832 200.581 18.738 200.106 19.6196L198.767 22.1066C198.607 22.4026 198.607 22.759 198.767 23.055L200.106 25.542C200.581 26.4236 199.609 27.3784 198.736 26.8881L196.36 25.5533ZM209.457 20.1804C208.579 20.6886 207.589 19.7168 208.082 18.8296L208.553 17.981C208.72 17.6792 208.72 17.3123 208.553 17.0105L208.082 16.1619C207.589 15.2747 208.579 14.303 209.457 14.8112L210.229 15.2578C210.539 15.4371 210.921 15.4371 211.23 15.2578L212.002 14.8112C212.88 14.303 213.87 15.2747 213.378 16.1619L212.907 17.0105C212.739 17.3123 212.739 17.6792 212.907 17.981L213.378 18.8296C213.87 19.7168 212.88 20.6886 212.002 20.1804L211.23 19.7337C210.921 19.5544 210.539 19.5544 210.229 19.7337L209.457 20.1804Z" fill="var(--color-illustration-element)" />
      <circle cx="61.5551" cy="60.8812" r="8.38124" fill="var(--color-illustration-element)" />
      <line x1="177.498" y1="57.715" x2="78.1204" y2="57.715" stroke="var(--color-illustration-element)" strokeWidth="4.78928" strokeLinecap="round" />
      <line x1="137.986" y1="67.2935" x2="78.1202" y2="67.2935" stroke="var(--color-illustration-element)" strokeWidth="4.78928" strokeLinecap="round" />
      <line x1="177.498" y1="76.8721" x2="78.1204" y2="76.8721" stroke="var(--color-illustration-element)" strokeWidth="4.78928" strokeLinecap="round" />
      <defs>
        <clipPath id="clip0_939_25445">
          <rect x="42.2002" y="42.4102" width="151.248" height="191.138" rx="7.18392" fill="var(--color-illustration-card)" />
        </clipPath>
      </defs>
    </svg>
  );
}

const schema = z.object({
  summary: z.string().trim().min(1, "Write a caption."),
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
  { name: "OneDrive", Icon: CloudUpload },
  { name: "Canva", Icon: Palette },
  { name: "Unsplash", Icon: ImagePlus },
  { name: "Fetch from URL", Icon: ArrowUpRight },
];

const acceptedTypes = "image/*,video/*,application/pdf";

type MediaFile = { id: string; file: File; url: string };

function TagsPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));

  function addTag() {
    const trimmed = input.trim().toLowerCase().replace(/^#/, "");
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setInput("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-40 items-center justify-between gap-2 rounded-xl bg-[var(--surface-card-alt)] px-3 py-2 text-sm font-medium transition hover:brightness-95"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Tag className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
          {selected.length > 0 ? (
            <span className="truncate">{selected.map((t) => `#${t}`).join(" ")}</span>
          ) : (
            "Tags"
          )}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)] transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-30 mt-2 w-56 rounded-2xl bg-white p-3 shadow-[0_12px_32px_rgba(41,41,40,0.16)]">
          <input
            type="text"
            placeholder="Search tags"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--surface-brand)]"
          />
          {selected.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selected.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onChange(selected.filter((t) => t !== tag))}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-accent)] px-2.5 py-1 text-xs font-medium text-[var(--surface-accent-foreground)] transition hover:brightness-95"
                >
                  #{tag}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addTag}
            disabled={!input.trim()}
            className="mt-3 w-full rounded-xl bg-[var(--surface-accent)] py-2 text-sm font-medium text-[var(--surface-accent-foreground)] transition hover:brightness-95 disabled:opacity-50"
          >
            New tag
          </button>
        </div>
      ) : null}
    </div>
  );
}

const emojiCategories = [
  {
    id: "smileys",
    icon: "😀",
    emojis: "😀 😃 😄 😁 😆 😅 😂 🤣 🥲 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 🤡 💩 👻 💀 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾".split(" "),
  },
  {
    id: "people",
    icon: "👍",
    emojis: "👋 🤚 🖐️ ✋ 🖖 👌 🤌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦵 🦶 👂 👃 🧠 🫀 🫁 🦷 🦴 👀 👁️ 👅 👄 💋 🩸 👶 🧒 👦 👧 🧑 👱 👨 🧔 👩 🧓 👴 👵 🙈 🙉 🙊".split(" "),
  },
  {
    id: "hearts",
    icon: "❤️",
    emojis: "❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 💯 🔥 ✨ ⭐ 🌟 💫 ⚡ 💥 💢 💤 💦 💨 🕳️ 💬 💭 ♨️ 🎵 🎶 💲 💰 💴 💵 💶 💷 💸 💳 💎 ⚖️ 🔧 🔨 ⚒️ 🛠️ ⚙️ 🔗 ⛓️ 🧲 🔫 💣 🧨 🔪 🗡️ 🛡️ 🚬 ⚰️ 🏺 🔮 📿 🧿 💈 ⚗️ 🔭 🔬".split(" "),
  },
  {
    id: "nature",
    icon: "🐻",
    emojis: "🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷️ 🕸️ 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🐈 🐓 🦃 🦚 🦜 🦢 🦩 🕊️ 🐇 🦝 🦔 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🎍 🎋 🍃 🍂 🍁 🍄 🐚 🌾 💐 🌷 🌹 🥀 🌺 🌸 🌼 🌻 🌞 🌝 🌛 🌜 🌚 🌕 🌖 🌗 🌘 🌑 🌒 🌓 🌔 🌙 🌎 🌍 🌏 🪐 💫 ⭐ 🌟 ✨ ⚡ ☄️ 💥 🔥 🌪️ 🌈 ☀️ 🌤️ ⛅ 🌥️ ☁️ 🌦️ 🌧️ ⛈️ 🌩️ 🌨️ ❄️ ☃️ ⛄ 🌬️ 💨 🌊 💧 💦 ☔".split(" "),
  },
  {
    id: "food",
    icon: "🍔",
    emojis: "🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥬 🥒 🌶️ 🫑 🌽 🥕 🫒 🧄 🧅 🥔 🍠 🥐 🥯 🍞 🥖 🥨 🧀 🥚 🍳 🧈 🥞 🧇 🥓 🥩 🍗 🍖 🌭 🍔 🍟 🍕 🫓 🥪 🥙 🧆 🌮 🌯 🥗 🥘 🥫 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🦪 🍤 🍙 🍚 🍘 🍥 🥠 🥮 🍢 🍡 🍧 🍨 🍦 🥧 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🌰 🥜 🍯 🥛 🍼 ☕ 🍵 🧃 🥤 🧋 🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🧉 🍾 🧊".split(" "),
  },
  {
    id: "activity",
    icon: "🎉",
    emojis: "⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🥏 🎱 🏓 🏸 🏒 🏑 🥍 🏏 🥅 ⛳ 🪁 🏹 🎣 🤿 🥊 🥋 🎽 🛹 🛼 🛷 ⛸️ 🥌 🎿 ⛷️ 🏂 🪂 🏋️ 🤼 🤸 ⛹️ 🤺 🤾 🏌️ 🏇 🧘 🏄 🏊 🤽 🚣 🧗 🚵 🚴 🏆 🥇 🥈 🥉 🏅 🎖️ 🏵️ 🎗️ 🎫 🎟️ 🎪 🤹 🎭 🩰 🎨 🎬 🎤 🎧 🎼 🎹 🥁 🪘 🎷 🎺 🪗 🎸 🪕 🎻 🎲 ♟️ 🎯 🎳 🎮 🎰 🧩 🎉 🎊 🎈 🎁 🎀 🎄 🎃 🎎 🎏 🎐".split(" "),
  },
  {
    id: "travel",
    icon: "✈️",
    emojis: "🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐 🛻 🚚 🚛 🚜 🛴 🚲 🛵 🏍️ 🛺 🚨 🚔 🚍 🚘 🚖 🚡 🚠 🚟 🚃 🚋 🚞 🚝 🚄 🚅 🚈 🚂 🚆 🚇 🚊 🚉 ✈️ 🛫 🛬 🛩️ 💺 🛰️ 🚀 🛸 🚁 🛶 ⛵ 🚤 🛥️ 🛳️ ⛴️ 🚢 ⚓ ⛽ 🚧 🚦 🚥 🗺️ 🗿 🗽 🗼 🏰 🏯 🏟️ 🎡 🎢 🎠 ⛲ ⛱️ 🏖️ 🏝️ 🏜️ 🌋 ⛰️ 🏔️ 🗻 🏕️ ⛺ 🏠 🏡 🏘️ 🏚️ 🏗️ 🏭 🏢 🏬 🏣 🏥 🏦 🏨 🏪 🏫 🏩 💒 🏛️ ⛪ 🕌 🕍 🛕 🕋 ⛩️".split(" "),
  },
  {
    id: "symbols",
    icon: "🔣",
    emojis: "✅ ❌ ❎ ✔️ ☑️ 🔘 🔴 🟠 🟡 🟢 🔵 🟣 ⚫ ⚪ 🟤 🔺 🔻 🔸 🔹 🔶 🔷 🔳 🔲 ▪️ ▫️ ◾ ◽ ◼️ ◻️ 🟥 🟧 🟨 🟩 🟦 🟪 ⬛ ⬜ 🟫 ➕ ➖ ➗ ✖️ 🟰 ♾️ 💲 💱 ™️ ©️ ®️ 〰️ ➰ ➿ 🔚 🔙 🔛 🔝 🔜 ⬆️ ⬇️ ⬅️ ➡️ ↗️ ↘️ ↙️ ↖️ ↕️ ↔️ ↩️ ↪️ ⤴️ ⤵️ 🔃 🔄 🔁 🔂 🔀 🔒 🔓 🔐 🔏 🔑 🗝️ 📢 📣 📯 🔔 🔕 🔇 🔈 🔉 🔊 📴 📱 📲 📶 📳 📵".split(" "),
  },
  {
    id: "flags",
    icon: "🚩",
    emojis: "🚩 🏁 🎌 🏴 🏳️ 🏳️‍🌈 🏴‍☠️ 🇮🇩 🇺🇸 🇬🇧 🇨🇦 🇦🇺 🇩🇪 🇫🇷 🇮🇹 🇪🇸 🇵🇹 🇳🇱 🇧🇪 🇨🇭 🇦🇹 🇸🇪 🇳🇴 🇩🇰 🇫🇮 🇵🇱 🇷🇺 🇺🇦 🇹🇷 🇬🇷 🇮🇪 🇯🇵 🇰🇷 🇨🇳 🇭🇰 🇹🇼 🇸🇬 🇲🇾 🇹🇭 🇻🇳 🇵🇭 🇮🇳 🇵🇰 🇧🇩 🇱🇰 🇸🇦 🇦🇪 🇮🇱 🇪🇬 🇿🇦 🇳🇬 🇰🇪 🇲🇦 🇧🇷 🇦🇷 🇨🇱 🇨🇴 🇵🇪 🇲🇽".split(" "),
  },
];

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(emojiCategories[0].id);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const current = emojiCategories.find((category) => category.id === active) ?? emojiCategories[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Insert emoji"
        title="Insert emoji"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-[var(--surface-card-alt)]"
      >
        <Smile className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute bottom-full left-0 z-30 mb-2 w-80 rounded-2xl bg-white p-2 shadow-[0_12px_32px_rgba(41,41,40,0.16)]">
          <div className="mb-1.5 flex items-center gap-0.5 border-b border-[var(--border-subtle)] pb-1.5">
            {emojiCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-label={category.id}
                onClick={() => setActive(category.id)}
                className={cn(
                  "flex h-8 flex-1 items-center justify-center rounded-lg text-lg transition",
                  active === category.id ? "bg-[var(--surface-card-alt)]" : "hover:bg-[var(--surface-card-alt)]",
                )}
              >
                {category.icon}
              </button>
            ))}
          </div>
          <div className="grid max-h-56 grid-cols-8 gap-0.5 overflow-y-auto">
            {current.emojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                type="button"
                onClick={() => {
                  onSelect(emoji);
                  setOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md text-xl transition hover:bg-[var(--surface-card-alt)]"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

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

export function CreatePostPage() {
  const router = useRouter();
  const { addContentItem, sessionUser, workspace } = useNava();
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useDismiss<HTMLDivElement>(scheduleOpen, () => setScheduleOpen(false));
  const fileInput = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [driveOpen, setDriveOpen] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const driveBtnRef = useRef<HTMLButtonElement>(null);
  const drivePopRef = useRef<HTMLDivElement>(null);
  const [drivePos, setDrivePos] = useState<{ top: number; left: number } | null>(null);
  const mediaRef = useRef<MediaFile[]>([]);
  const [form, setForm] = useState({
    summary: "",
    scheduledFor: "2026-10-09T09:00",
    clientId: null as string | null,
    platforms: ["instagram"] as string[],
    tags: [] as string[],
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
    if (!driveOpen) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (driveBtnRef.current?.contains(target)) return;
      if (drivePopRef.current?.contains(target)) return;
      setDriveOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [driveOpen]);

  useEffect(() => {
    if (!driveOpen) return;
    const place = () => {
      const el = driveBtnRef.current;
      const pop = drivePopRef.current;
      if (!el || !pop) return;
      const rect = el.getBoundingClientRect();
      const popRect = pop.getBoundingClientRect();
      const gap = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < popRect.height + gap && rect.top > popRect.height + gap;
      let top = openUp ? rect.top - popRect.height - gap : rect.bottom + gap;
      top = Math.max(gap, Math.min(top, window.innerHeight - popRect.height - gap));
      let left = rect.left;
      left = Math.max(gap, Math.min(left, window.innerWidth - popRect.width - gap));
      setDrivePos({ top, left });
    };
    const frame = requestAnimationFrame(place);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [driveOpen, urlOpen]);

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

  function addUrlMedia() {
    const url = urlValue.trim();
    if (!url) return;
    setMedia((previous) => [
      ...previous,
      {
        id: `url-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file: new File([], "image-from-url.png", { type: "image/png" }),
        url,
      },
    ]);
    setUrlValue("");
    setUrlOpen(false);
    setDriveOpen(false);
    setNotice(null);
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

  function update(field: keyof typeof form, value: string | string[]) {
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

  function publish(scheduledFor: string, status: ContentStatus = "scheduled") {
    const result = schema.safeParse({ ...form, clientId: form.clientId ?? (workspace?.selectedClientId && workspace.selectedClientId !== "all" ? workspace.selectedClientId : ""), scheduledFor });

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
      status,
    });
    router.push("/app/approval");
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
        publish(form.scheduledFor, "scheduled");
      }}
      className="grid gap-4 lg:h-[calc(100vh-2rem)] lg:grid-cols-[minmax(0,1fr)_380px]"
    >

      <div className="flex min-h-0 flex-col gap-4">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
      <aside className="flex flex-col rounded-[24px] bg-white p-5">
        <h2 className="mb-3 text-base font-semibold">Create Post</h2>
        <div className="mb-4">
          <TagsPicker selected={form.tags} onChange={(tags) => update("tags", tags)} />
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
      </aside>
        <div className="space-y-4">
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
              <div className="relative">
                <button
                  ref={driveBtnRef}
                  type="button"
                  aria-label="Connect a drive"
                  aria-expanded={driveOpen}
                  onClick={() => {
                    setDriveOpen((previous) => !previous);
                    setUrlOpen(false);
                  }}
                  className="flex h-9 items-center gap-1.5 rounded-lg px-2 hover:bg-[var(--surface-card-alt)]"
                >
                  <Plus className="h-4 w-4" />
                  <ChevronDown className={cn("h-3 w-3 transition", driveOpen && "rotate-180")} />
                </button>
              </div>
              {driveOpen
                ? createPortal(
                    <div
                      ref={drivePopRef}
                      style={{ position: "fixed", top: drivePos?.top ?? -9999, left: drivePos?.left ?? -9999 }}
                      className="z-[60] w-60 rounded-2xl bg-white p-1.5 shadow-[0_12px_32px_rgba(41,41,40,0.16)]"
                    >
                      <ul>
                        {driveProviders.map(({ name, Icon }) => (
                          <li key={name}>
                            <button
                              type="button"
                              onClick={() => {
                                if (name === "Fetch from URL") {
                                  setUrlOpen(true);
                                  requestAnimationFrame(() => {
                                    const input = drivePopRef.current?.querySelector("input");
                                    input?.focus();
                                  });
                                  return;
                                }
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
                      {urlOpen ? (
                        <div className="mt-1 space-y-2 border-t border-[var(--border-subtle)] p-2">
                          <input
                            type="url"
                            inputMode="url"
                            autoFocus
                            placeholder="Paste image URL"
                            value={urlValue}
                            onChange={(event) => setUrlValue(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                addUrlMedia();
                              }
                            }}
                            className="w-full rounded-xl border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--surface-brand)]"
                          />
                          <button
                            type="button"
                            onClick={addUrlMedia}
                            disabled={!urlValue.trim()}
                            className="w-full rounded-xl bg-[var(--surface-accent)] py-2 text-sm font-medium text-[var(--surface-accent-foreground)] transition hover:brightness-95 disabled:opacity-50"
                          >
                            Fetch image
                          </button>
                        </div>
                      ) : null}
                    </div>,
                    document.body,
                  )
                : null}
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
                <EmojiPicker onSelect={(emoji) => update("summary", form.summary + emoji)} />
                <AtSign className="h-4 w-4" />
                <Hash className="h-4 w-4" />
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-xs">{form.summary.length}</span>
            </div>
          </Panel>
          {error ? <p role="alert" className="px-2 text-sm text-rose-600">{error}</p> : null}
        </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 rounded-[24px] bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => publish(form.scheduledFor, "draft")}
            className="inline-flex h-9 items-center rounded-xl px-3 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)]"
          >
            Save Draft
          </button>
          <div className="flex">
            <div ref={scheduleRef} className="relative">
              <button
                type="button"
                onClick={() => setScheduleOpen((previous) => !previous)}
                aria-haspopup="dialog"
                aria-expanded={scheduleOpen}
                className="inline-flex h-9 items-center gap-2 rounded-l-xl border border-[var(--border-subtle)] bg-white px-4 text-sm font-medium text-foreground hover:bg-[var(--surface-card-alt)]"
              >
                <CalendarRange className="h-4 w-4" /> Schedule Post
              </button>
              {scheduleOpen ? (
                <div className="absolute bottom-full right-0 z-50 mb-2 w-80 rounded-2xl bg-white p-4 shadow-[0_12px_32px_rgba(41,41,40,0.16)]">
                  <p className="mb-2 text-sm font-medium">Schedule Post</p>
                  <DateTimePicker value={form.scheduledFor} onChange={(value) => update("scheduledFor", value)} />
                  <button
                    type="button"
                    onClick={() => {
                      publish(form.scheduledFor, "scheduled");
                      setScheduleOpen(false);
                    }}
                    className="mt-3 w-full rounded-xl bg-[var(--surface-accent)] py-2 text-sm font-medium text-[var(--surface-accent-foreground)] transition hover:brightness-95"
                  >
                    Schedule
                  </button>
                </div>
              ) : null}
            </div>
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="More publish options"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((previous) => !previous)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-r-xl border border-l-0 border-[var(--border-subtle)] bg-white text-foreground hover:bg-[var(--surface-card-alt)]"
              >
                <ChevronDown className={cn("h-4 w-4 transition", menuOpen && "rotate-180")} />
              </button>
              {menuOpen ? (
                <ul className="absolute bottom-full right-0 z-30 mb-2 w-44 rounded-2xl bg-white p-1.5 shadow-[0_12px_32px_rgba(41,41,40,0.16)]">
                  <li>
                    <button
                      type="button"
                      onClick={() => { publish(toLocalValue(new Date()), "scheduled"); setMenuOpen(false); }}
                      className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-card-alt)]"
                    >
                      <Send className="mr-2 h-4 w-4" /> Publish Now
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { publish(nextSlot(), "scheduled"); setMenuOpen(false); }}
                      className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-card-alt)]"
                    >
                      <Clock3 className="mr-2 h-4 w-4" /> Schedule Next
                    </button>
                  </li>
                </ul>
              ) : null}
            </div>
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
                {media.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {media.slice(0, 4).map((item) => (
                      <div key={item.id} className="aspect-square overflow-hidden rounded-lg">
                        {item.file.type.startsWith("image/") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt={item.file.name} className="h-full w-full object-cover" />
                        ) : item.file.type.startsWith("video/") ? (
                          <video src={item.url} muted className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[var(--surface-card-alt)]">
                            <FileText className="h-6 w-6 text-[var(--muted-foreground)]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className="my-4 whitespace-pre-wrap text-sm">
                  {form.summary}
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
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-10 text-center">
            <NoPreviewIllustration className="mb-4 h-40 w-auto" />
            <p className="text-sm font-semibold text-foreground">No preview yet</p>
          </div>
        )}
      </aside>
    </form>
  );
}
