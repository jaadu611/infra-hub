import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText } from "lucide-react";

export interface Document {
  name: string;
  createdAt: string | Date;
  addedBy?: {
    name: string;
    email: string;
  };
  title?: string;
}

interface ProjectDocumentProps {
  documents: Document[];
}

const ProjectDocument: React.FC<ProjectDocumentProps> = ({ documents }) => {
  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  return (
    <Card className="dark:bg-gray-800/80 dark:border-gray-700 shadow-xl py-6! border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          Project Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents?.length ? (
          <div className="space-y-2">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center dark:border-gray-700 justify-between p-3 dark:bg-gray-700 bg-gray-200 border border-gray-300 rounded-lg"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <span>{doc.name}</span>
                  </div>
                  {doc.addedBy && (
                    <span className="text-xs text-gray-400">
                      Added by: {doc.addedBy.name} ({doc.addedBy.email})
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  {formatDate(doc.createdAt)}
                </span>
              </div>
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
