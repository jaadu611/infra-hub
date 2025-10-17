"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Copy,
  Key,
  Lock,
  Check,
  Shield,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface SecurityAndAuthProps {
  apiKey: string;
  authSecret: string;
  projectId: string;
}

const SecurityAndAuth: React.FC<SecurityAndAuthProps> = ({
  apiKey,
  authSecret,
  projectId,
}) => {
  const [copiedField, setCopiedField] = useState<
    "Api Key" | "Auth Secret" | null
  >(null);
  const [showAuthSecret, setShowAuthSecret] = useState(false);
  const [authSecretValue, setAuthSecretValue] = useState(authSecret);
  const [originalAuthSecret, setOriginalAuthSecret] = useState(authSecret);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = (value: string, field: "Api Key" | "Auth Secret") => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      toast.success(`${field} copied successfully`);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/projects/${projectId}/auth-secret`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authSecret: authSecretValue }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update auth secret");

      toast.success("Auth Secret updated successfully!");
      setOriginalAuthSecret(authSecretValue);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update auth secret");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-gray-800/80 border-0 shadow-xl py-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
            <Shield className="h-5 w-5 text-red-600" />
          </div>
          Security & Authentication
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* API Key */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(apiKey, "Api Key")}
            >
              {copiedField === "Api Key" ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Input
            type="text"
            value={apiKey}
            readOnly
            className="bg-gray-700 border-gray-600 text-white font-mono text-sm cursor-not-allowed opacity-70"
          />
        </div>

        {/* Auth Secret */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Auth Secret
            </label>
            <div className="flex items-center gap-2">
              {authSecretValue !== originalAuthSecret && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-green-400/40"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 text-green-400" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-indigo-400/40"
                onClick={() => handleCopy(authSecretValue, "Auth Secret")}
              >
                {copiedField === "Auth Secret" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="relative flex items-center">
            <Input
              type={showAuthSecret ? "text" : "password"}
              value={authSecretValue}
              onChange={(e) => setAuthSecretValue(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white font-mono text-sm pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1"
              onClick={() => setShowAuthSecret(!showAuthSecret)}
            >
              {showAuthSecret ? (
                <EyeOff className="h-4 w-4 text-gray-300" />
              ) : (
                <Eye className="h-4 w-4 text-gray-300" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAndAuth;
