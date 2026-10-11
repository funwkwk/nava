"use client";

import { Facebook, Instagram, Linkedin, Threads, Bluesky, Substack, Youtube, Tiktok, Mastodon, X, XTwitter } from "@/components/nava/icons";
import { useState } from "react";
import { platformCatalog } from "@/lib/nava/navigation";

const channelIcons = {
  instagram: Instagram,
  threads: Threads,
  linkedin: Linkedin,
  facebook: Facebook,
  bluesky: Bluesky,
  substack: Substack,
  youtube: Youtube,
  tiktok: Tiktok,
  x: XTwitter,
} as const;
const channelOrder = ["instagram", "threads", "linkedin", "facebook", "bluesky", "substack", "youtube", "tiktok", "x"];

export function ConnectChannelDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  if (!open) return null;
  return (
    <div role="presentation" className="fixed inset-0 z-[60] flex items-center justify-center bg-[#292928]/75 p-3 sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="connect-channel-title" className="relative flex max-h-[min(82vh,760px)] w-full max-w-[900px] flex-col rounded-[20px] bg-[#f8f7f5] p-5 sm:p-6">
        <button type="button" aria-label="Close" onClick={onClose} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#555]" ><X className="h-4 w-4" /></button>
        <h2 id="connect-channel-title" className="mb-5 pr-12 text-center text-xl font-semibold tracking-tight sm:mb-6 sm:text-2xl">Connect a New Channel</h2>
        <div className="overflow-y-auto px-1 pb-1">
          <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {[...platformCatalog].sort((left, right) => channelOrder.indexOf(left.value) - channelOrder.indexOf(right.value)).map((channel) => {
              const Icon = channelIcons[channel.value];
              return <button key={channel.value} type="button" onClick={() => setSelectedChannel(channel.label)} className="flex min-h-[154px] flex-col items-center justify-center rounded-xl bg-white px-4 py-5 text-center sm:min-h-[168px]">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: channel.accent }}>
                  <Icon className="h-6 w-6" color="#ffffff" />
                </span>
                <span className="text-base font-semibold text-[#292928]">{channel.label}</span>
                <span className="mt-1 text-sm text-[#70706f]">Connect Account</span>
              </button>;
            })}
            <button type="button" onClick={() => setSelectedChannel("Mastodon")} className="flex min-h-[154px] flex-col items-center justify-center rounded-xl bg-white px-4 py-5 text-center sm:min-h-[168px]">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#6364ff] text-white"><Mastodon className="h-6 w-6" color="#ffffff" /></span>
              <span className="text-base font-semibold text-[#292928]">Mastodon</span>
              <span className="mt-1 text-sm text-[#70706f]">Connect Account</span>
            </button>
          </div>
          {selectedChannel ? <p role="status" className="mx-auto mt-4 max-w-[760px] rounded-xl bg-white px-4 py-3 text-center text-sm text-[#70706f]">{selectedChannel} connection is not configured yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
