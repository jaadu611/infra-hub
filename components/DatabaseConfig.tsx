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
    <Card className="bg-gray-800/80 border-0 shadow-xl py-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          Database Configuration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-12">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">
              MongoDB Connection URL
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-indigo-400/40!"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>

              {isChanged && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-green-400/40 transition-all"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 text-green-400" />
                </Button>
              )}
            </div>
          </div>

          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between p-4 bg-green-900/10 rounded-lg border border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-200">Connection Status</p>
              <p className="text-sm text-green-400">Active and healthy</p>
            </div>
          </div>
          <Button className="px-3 py-1 text-sm rounded-sm bg-red-600/30 text-white hover:bg-red-600/50 shadow-md border border-red-700 uppercase tracking-wide">
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;
