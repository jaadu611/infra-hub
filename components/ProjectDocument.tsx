import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export interface Document {
  id: string;
  name: string;
  createdAt: string | Date;
  owner?: {
    name: string;
    email: string;
  };
  title?: string;
}

interface ProjectDocumentProps {
  documents: Document[];
  projectId: string;
}

const ProjectDocument: React.FC<ProjectDocumentProps> = ({
  documents,
  projectId,
}) => {
  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="dark:bg-gray-800/80 dark:border-gray-700 shadow-xl py-6! border border-gray-200">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center justify-between w-full">
          <CardTitle>
            <Link
              href={`/documents/${projectId}`}
              className="flex items-center gap-3 w-full p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 focus:ring-2 focus:ring-purple-400 transition-all"
            >
              <span className="p-1.5 rounded-lg bg-white/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </span>
              <span className="flex-1 font-semibold text-sm">
                Project Documents
              </span>
              <ArrowRight className="h-4 w-4 text-white" />
            </Link>
          </CardTitle>
        </div>

        <Link href={`/new-document/${projectId}`}>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
            <Plus />
            Add New Document
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents?.length ? (
          <div className="flex flex-col gap-6">
            {documents.map((doc) => (
              <Link key={doc.id} href={`/document/${doc.id}`}>
                <div className="flex items-center dark:border-gray-700 justify-between p-3 dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-200 border border-gray-300 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <span>{doc.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Added by: {doc.owner!.name} ({doc.owner!.email})
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatDate(doc.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-700/30 rounded-lg text-center space-y-2">
            <FileText className="h-8 w-8 text-purple-400" />
            <p className="text-gray-200 font-medium">No documents found</p>
            <p className="text-gray-400 text-sm">
              Upload a document to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectDocument;
