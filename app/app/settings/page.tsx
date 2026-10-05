import type { Metadata } from "next";
import { SettingsPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
