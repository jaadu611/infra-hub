import type { ReactNode } from "react";
import { UserProvider } from "@/context/UserProvider";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Fetch the session server-side
  const session = await auth();
  const user = session?.user
    ? {
        id: session.user.id!,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      }
    : null;

  if (user) {
    return redirect("/");
  }

  return (
    <UserProvider user={user}>
      {children}
      <Toaster />
    </UserProvider>
  );
}
