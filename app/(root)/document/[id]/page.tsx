import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDocumentDetails } from "@/lib/db";
import { Code2, Plus, RefreshCcw, Tag, User } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownClient";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const document = await getDocumentDetails(id);
  if (!document) notFound();

  return (
    <div className="h-[654px] flex flex-col bg-background text-gray-900 dark:text-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <Card className="flex-1 py-4 gap-0 overflow-y-auto m-0 mr-6 shadow-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <CardContent className="h-full overflow-y-auto prose dark:prose-invert max-w-none px-4">
            <MarkdownRenderer
              content={document.content || "No content available."}
            />
          </CardContent>
        </Card>

        <Card className="w-80 py-6 shrink-0 m-0 gap-0 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Document Info
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 text-sm overflow-y-auto p-6">
            {/* Document Name */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Document Name
                </p>
              </div>
              <p className="text-base font-medium text-gray-900 dark:text-gray-100 pl-6 truncate">
                {document.name ?? "Untitled Document"}
              </p>
            </div>

            {/* Owner */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Owner
                </p>
              </div>
              <div className="pl-6">
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {document.owner?.name ?? "Unknown"}
                </p>
                {document.owner?.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {document.owner.email}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Created At */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Created
                </p>
              </div>
              <div className="pl-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(document.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(document.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCcw className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Last Updated
                </p>
              </div>
              <div className="pl-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(document.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(document.updatedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Document ID
                </p>
              </div>
              <div className="pl-6 flex items-center gap-2">
                <code className="text-xs max-w-fit text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded truncate flex-1">
                  {document._id}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
