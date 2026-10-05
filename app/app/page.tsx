import type { Metadata } from "next";
import { DashboardPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
