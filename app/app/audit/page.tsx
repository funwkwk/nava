import type { Metadata } from "next";
import { AuditPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Audit",
};

export default function AuditRoute() {
  return <AuditPage />;
}
