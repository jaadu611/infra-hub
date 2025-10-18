"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Copy, Database, Zap, Check, Save } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface DatabaseConfigProps {
  mongoUrl: string;
  projectId: string;
}

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({
  mongoUrl,
  projectId,
}) => {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(mongoUrl);
  const [saving, setSaving] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(url !== mongoUrl);
  }, [url, mongoUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("MongoDB URL copied successfully");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch(`/api/projects/${projectId}/mongo-url`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mongoUrl: url }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update MongoDB URL");

      toast.success("MongoDB URL updated successfully!");
      setIsChanged(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update MongoDB URL");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md py-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          Database Configuration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              MongoDB Connection URL
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </Button>

              {isChanged && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                >
                  <Save className="h-4 w-4 text-green-500" />
                </Button>
              )}
            </div>
          </div>

          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />
        </div>

        <Separator className="border-gray-300 dark:border-gray-600" />

        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
              <Zap className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="font-medium text-green-700 dark:text-green-200">
                Connection Status
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Active and healthy
              </p>
            </div>
          </div>
          <Button className="px-3 py-1 text-sm rounded-sm bg-red-600/70 dark:bg-red-600/40 dark:hover:bg-red-600/70 text-white hover:bg-red-600 border border-red-700 shadow-sm">
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;
