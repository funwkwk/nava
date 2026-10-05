import type { Metadata } from "next";
import { AnalyticsPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AnalyticsRoute() {
  return <AnalyticsPage />;
}
