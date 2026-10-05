import type { Metadata } from "next";
import { AuthPage } from "@/components/nava/auth-page";

export const metadata: Metadata = {
  title: "Signup",
};

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
