import { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Sign In — Fit Flow",
  description: "Sign in to your Fit Flow account to manage your fitness programs, track health metrics, and connect with your trainer.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
