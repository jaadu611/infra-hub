import { auth } from "@/auth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThemeProvider } from "next-themes";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user
    ? {
        id: session.user.id!,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      }
    : null;

  if (!user) {
    return redirect("/signup");
  }
  return (
    <main>
      <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        <DashboardLayout>{children}</DashboardLayout>
      </ThemeProvider>
    </main>
  );
}
