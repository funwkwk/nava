import type { Metadata } from "next";
import { PostsPage } from "@/components/nava/workspace-pages";

export const metadata: Metadata = {
  title: "Posts",
};

export default function ContentRoute() {
  return <PostsPage />;
}
