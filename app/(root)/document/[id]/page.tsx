import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getDocumentDetails } from "@/lib/db";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const document = await getDocumentDetails(params.id);

  if (!document) {
    notFound();
  }

  const createdAt = new Date(document.createdAt ?? new Date()).toLocaleString();
  const updatedAt = new Date(document.updatedAt ?? new Date()).toLocaleString();

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-6xl mx-auto bg-background/90 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {document.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Created by{" "}
              <span className="font-medium">
                {document.owner?.name ?? "Unknown"}
              </span>
            </p>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          type="submit"
          className="dark:bg-red-500/70! dark:hover:bg-red-500/80! border border-red-700 hover:bg-red-500!"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Content & Metadata */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Document Content */}
        <Card className="md:col-span-2 py-4 shadow-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Content</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Markdown / Text Body
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm whitespace-pre-wrap font-mono border border-gray-200 dark:border-gray-600">
              {document.content || "No content available."}
            </pre>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="shadow-lg py-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Metadata</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Document information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-gray-400 dark:text-gray-500 uppercase text-xs">
                Document ID
              </p>
              <p className="font-mono mt-1 break-all">{document._id}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 uppercase text-xs">
                Owner
              </p>
              <p className="mt-1">{document.owner?.name ?? "Unknown"}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 uppercase text-xs">
                Created At
              </p>
              <p className="mt-1">{createdAt}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-gray-500 uppercase text-xs">
                Last Updated
              </p>
              <p className="mt-1">{updatedAt}</p>
            </div>
            {document.project && (
              <div>
                <p className="text-gray-400 dark:text-gray-500 uppercase text-xs">
                  Project
                </p>
                <p className="mt-1">{document.project.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
