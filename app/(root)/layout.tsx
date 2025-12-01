import { auth } from "@/auth";
import { DashboardLayout } from "@/components/DashboardLayout";
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
    return redirect("/");
  }
  return (
    <main>
      <DashboardLayout>{children}</DashboardLayout>
    </main>
  );
}
