"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Copy, Database, Zap, Check, Save, PlugZap } from "lucide-react";
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
  const [verifying, setVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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

  const handleVerify = async () => {
    try {
      setVerifying(true);

      const res = await fetch(`/api/projects/connect/${projectId}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to verify MongoDB URL");

      toast.success("MongoDB URL is valid!");
      setIsConnected(true);
    } catch (err) {
      console.error(err);
      toast.error("Verification failed. Check your MongoDB URL.");
      setIsConnected(false);
    } finally {
      setVerifying(false);
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

        <div
          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
            isConnected
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isConnected
                  ? "bg-green-100 dark:bg-green-900/20"
                  : "bg-yellow-100 dark:bg-yellow-900/20"
              }`}
            >
              <Zap
                className={`h-4 w-4 ${
                  isConnected
                    ? "text-green-600 dark:text-green-300"
                    : "text-yellow-600 dark:text-yellow-300"
                }`}
              />
            </div>
            <div>
              <p
                className={`font-medium ${
                  isConnected
                    ? "text-green-700 dark:text-green-200"
                    : "text-yellow-700 dark:text-yellow-200"
                }`}
              >
                Connection Status
              </p>
              <p
                className={`text-sm ${
                  isConnected
                    ? "text-green-600 dark:text-green-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {isConnected ? "Active and healthy" : "Not verified yet"}
              </p>
            </div>
          </div>

          <Button
            disabled={verifying}
            onClick={handleVerify}
            className={`px-3 py-1 text-sm rounded-sm text-white shadow-sm ${
              isConnected
                ? "bg-green-600 pointer-events-none"
                : "bg-blue-600/70 hover:bg-blue-600 dark:bg-blue-600/40 dark:hover:bg-blue-600/70"
            }`}
          >
            {verifying ? (
              "Verifying..."
            ) : isConnected ? (
              <>
                <PlugZap className="w-4 h-4 mr-1" /> Verified
              </>
            ) : (
              <>
                <PlugZap className="w-4 h-4 mr-1" /> Verify URL
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;
