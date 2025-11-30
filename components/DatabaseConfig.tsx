"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Copy,
  Database,
  Zap,
  Check,
  Save,
  PlugZap,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface DatabaseConfigProps {
  mongoUrl: string;
  projectId: string;
  userRole: "admin" | "editor" | "viewer";
}

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({
  mongoUrl,
  projectId,
  userRole,
}) => {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(mongoUrl);
  const [saving, setSaving] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [lastVerified, setLastVerified] = useState<Date | null>(null);

  useEffect(() => {
    setIsChanged(url !== mongoUrl);
  }, [url, mongoUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("MongoDB URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = async () => {
    if (!url.trim()) {
      toast.error("MongoDB URL cannot be empty");
      return;
    }

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
      setIsConnected(null);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Failed to update MongoDB URL");
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

      if (!res.ok) throw new Error("Failed to verify MongoDB connection");

      toast.success("Database connection verified successfully!");
      setIsConnected(true);
      setLastVerified(new Date());
    } catch (err) {
      console.error(err);
      toast.error(
        (err as Error).message || "Connection failed. Check your MongoDB URL."
      );
      setIsConnected(false);
    } finally {
      setVerifying(false);
    }
  };

  const maskUrl = (url: string) => {
    if (!url) return "";
    const match = url.match(/mongodb(\+srv)?:\/\/([^@]+)@(.+)/);
    if (match) {
      return `mongodb${match[1] || ""}://****:****@${match[3]}`;
    }
    return "••••••••••••••••••••";
  };

  const getConnectionStatusColor = () => {
    if (isConnected === true)
      return "from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600";
    if (isConnected === false)
      return "from-red-500 to-rose-500 dark:from-red-600 dark:to-rose-600";
    return "from-yellow-500 to-amber-500 dark:from-yellow-600 dark:to-amber-600";
  };

  const getConnectionBgColor = () => {
    if (isConnected === true)
      return "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50";
    if (isConnected === false)
      return "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50";
    return "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700";
  };

  return (
    <Card className="bg-white gap-0 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
      <CardHeader className="relative border-b gap-0 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-800/30 pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4 pt-6">
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getConnectionStatusColor()} rounded-xl blur-lg opacity-30 animate-pulse`}
              />
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Database Configuration
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your MongoDB connection
              </p>
            </div>
          </div>

          {/* Connection Indicator Badge */}
          {isConnected !== null && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isConnected
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              {isConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                    Valid
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                    Invalid
                  </span>
                </>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6 p-6">
        {/* MongoDB URL Input Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Database className="w-4 h-4" />
              MongoDB Connection URL
            </label>
            <div className="flex items-center gap-2">
              {/* Show/Hide Toggle */}
              {userRole !== "viewer" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUrl(!showUrl)}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
                  title={showUrl ? "Hide URL" : "Show URL"}
                >
                  {showUrl ? (
                    <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                  )}
                </Button>
              )}

              {/* Copy Button */}
              {userRole !== "viewer" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all group"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500 animate-in zoom-in" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  )}
                </Button>
              )}

              {isChanged && userRole !== "viewer" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="hover:bg-green-100 dark:hover:bg-green-900/20 transition-all animate-in slide-in-from-right group"
                  title="Save changes"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 text-green-500 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 text-green-500 group-hover:text-green-600" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            <Input
              type="text"
              value={showUrl ? url : maskUrl(url)}
              onChange={(e) => setUrl(e.target.value)}
              disabled={!showUrl}
              placeholder="mongodb+srv://username:password@cluster.mongodb.net/database"
              className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all pr-10"
            />
            {isChanged && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>

          {isChanged && (
            <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg animate-in slide-in-from-top">
              <AlertCircle className="w-4 h-4" />
              You have unsaved changes. Click the save icon to apply.
            </div>
          )}
        </div>

        <Separator className="border-t border-gray-200 dark:border-gray-700" />

        {/* Connection Status Section */}
        <div
          className={`relative overflow-hidden rounded-xl border-2 transition-all duration-500 ${getConnectionBgColor()}`}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />

          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`relative p-3 rounded-xl bg-gradient-to-br ${getConnectionStatusColor()} shadow-lg`}
                >
                  {isConnected === true && (
                    <CheckCircle2 className="h-6 w-6 text-white animate-in zoom-in" />
                  )}
                  {isConnected === false && (
                    <XCircle className="h-6 w-6 text-white animate-in zoom-in" />
                  )}
                  {isConnected === null && (
                    <Zap className="h-6 w-6 text-white" />
                  )}
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping" />
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Connection Status
                    {verifying && (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isConnected === true &&
                      "Database is connected and operational"}
                    {isConnected === false &&
                      "Unable to connect to the database"}
                    {isConnected === null && "Connection not verified yet"}
                  </p>
                  {lastVerified && isConnected && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Last verified: {lastVerified.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              <Button
                disabled={verifying || saving}
                onClick={handleVerify}
                className={`px-5 py-2.5 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ${
                  isConnected === true
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : isConnected === true ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Re-verify
                  </>
                ) : (
                  <>
                    <PlugZap className="w-4 h-4" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              Connection Tips
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
              <li>Ensure your MongoDB URL includes the correct credentials</li>
              <li>Whitelist your IP address in MongoDB Atlas network access</li>
              <li>
                Verify the database name is correct in your connection string
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;
