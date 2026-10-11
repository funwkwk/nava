import type { Metadata } from "next";
import { ApprovalPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Post",
};

export default function ApprovalRoute() {
  return <ApprovalPage />;
}
