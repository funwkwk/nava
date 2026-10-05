import type { Metadata } from "next";
import { AuthPage } from "@/components/nava/auth-page";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return <AuthPage mode="forgot-password" />;
}
