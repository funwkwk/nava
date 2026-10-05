import type { Metadata } from "next";
import { AuthPage } from "@/components/nava/auth-page";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
