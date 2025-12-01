// app/docs/page.tsx
import { redirect } from "next/navigation";

export default function DocsIndexRedirect() {
  redirect("/docs/overview/what-is-infrahub");
}
