import type { Metadata } from "next";
import { ApprovalPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Approval",
};

export default function ApprovalRoute() {
  return <ApprovalPage />;
}
