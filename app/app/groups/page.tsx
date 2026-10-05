import type { Metadata } from "next";
import { GroupsPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Groups",
};

export default function GroupsRoute() {
  return <GroupsPage />;
}
