import type { Metadata } from "next";
import { SettingsPage } from "@/components/nava/settings-page";

export const metadata: Metadata = {
  title: "Settings & Security | NAVA",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
