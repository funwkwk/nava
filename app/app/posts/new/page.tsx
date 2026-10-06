import type { Metadata } from "next";
import { CreatePostPage } from "@/components/nava/create-post-page";

export const metadata: Metadata = {
  title: "Create Post",
};

export default function CreatePostRoute() {
  return <CreatePostPage />;
}
