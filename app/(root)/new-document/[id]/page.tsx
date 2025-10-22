import DocumentEditor from "@/components/DocumentEditor";
import React from "react";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  return <DocumentEditor projectId={id} />;
}
