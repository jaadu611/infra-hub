"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Copy, Key, Lock, Shield, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SecurityAndAuthProps {
  apiKey: string;
  authSecret: string;
}

const SecurityAndAuth: React.FC<SecurityAndAuthProps> = ({
  apiKey,
  authSecret,
}) => {
  const [copiedField, setCopiedField] = useState<
    "Api Key" | "Auth Secret" | null
  >(null);
  const [showAuthSecret, setShowAuthSecret] = useState(false);

  const handleCopy = (value: string, field: "Api Key" | "Auth Secret") => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      toast.success(`${field} copied successfully`);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md py-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-300" />
          </div>
          Security & Authentication
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* API Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-400 flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key
            </label>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleCopy(apiKey, "Api Key")}
            >
              {copiedField === "Api Key" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </Button>
          </div>
          <p className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-mono text-sm px-3 py-2 rounded">
            {apiKey}
          </p>
        </div>

        {/* Auth Secret */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-400 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Auth Secret
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleCopy(authSecret, "Auth Secret")}
              >
                {copiedField === "Auth Secret" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowAuthSecret(!showAuthSecret)}
              >
                {showAuthSecret ? (
                  <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
            </div>
          </div>
          <p className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-mono text-sm px-3 py-2 rounded">
            {showAuthSecret ? authSecret : "•••••••••••••••••••••••"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAndAuth;
