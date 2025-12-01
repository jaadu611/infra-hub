import type { ReactNode } from "react";
import WelcomeNavbar from "@/components/welcomeNavbar";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <WelcomeNavbar />

      {/* Wrapper under navbar */}
      <div className="h-[calc(100vh-73px)] overflow-hidden">{children}</div>
    </>
  );
}
