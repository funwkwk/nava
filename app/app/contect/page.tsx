import type { Metadata } from "next";
import { ContectPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Contect",
};

export default function ContectRoute() {
  return <ContectPage />;
}
