import type { Metadata } from "next";
import { AuthPage } from "@/components/nava/auth-page";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return <AuthPage mode="reset-password" />;
}
