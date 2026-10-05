import type { Metadata } from "next";
import { AccountsPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Accounts",
};

export default function AccountsRoute() {
  return <AccountsPage />;
}
