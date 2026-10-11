import type { Metadata } from "next";
import { TaskPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Tasks",
};

export default function PostsRoute() {
  return <TaskPage />;
}
