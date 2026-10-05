import type { Metadata } from "next";
import { InboxPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Inbox",
};

export default function InboxRoute() {
  return <InboxPage />;
}
