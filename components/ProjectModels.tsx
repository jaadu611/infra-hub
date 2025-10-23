"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface ProjectModelsProps {
  projectId: string;
}

const ProjectModels: React.FC<ProjectModelsProps> = ({ projectId }) => {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch(`/api/models/${projectId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch models");
        setModels(data.models || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, [projectId]);

  return (
    <Card className="dark:bg-gray-800/80 dark:border-gray-700 shadow-xl py-6 border border-gray-200">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Project Models
          </h2>
        </div>

        <Link href={`/create-model/${projectId}`}>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Model
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-gray-400">Loading models...</p>
        ) : models.length > 0 ? (
          <div className="flex flex-col gap-4">
            {models.map((model) => (
              <Link key={model} href={`/model/${projectId}/${model}`}>
                <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all rounded-lg border border-gray-300 dark:border-gray-600">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    {model}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-700/30 rounded-lg text-center space-y-2">
            <FileText className="h-8 w-8 text-purple-400" />
            <p className="text-gray-200 font-medium">No models found</p>
            <p className="text-gray-400 text-sm">
              Create a new model to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectModels;
