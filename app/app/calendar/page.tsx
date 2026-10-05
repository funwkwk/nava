import type { Metadata } from "next";
import { CalendarPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Calender",
};

export default function CalendarRoute() {
  return <CalendarPage />;
}
