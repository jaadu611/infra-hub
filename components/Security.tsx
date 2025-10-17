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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key
            </label>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-indigo-400/40!"
              onClick={() => handleCopy(apiKey, "Api Key")}
            >
              {copiedField === "Api Key" ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="bg-gray-700 border-gray-600 text-white font-mono text-sm px-3 py-2 rounded">
            {apiKey}
          </p>
        </div>

        {/* Auth Secret */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Auth Secret
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-indigo-400/40!"
                onClick={() => handleCopy(authSecret, "Auth Secret")}
              >
                {copiedField === "Auth Secret" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-indigo-400/40!"
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
          <p className="bg-gray-700 border-gray-600 text-white font-mono text-sm px-3 py-2 rounded">
            {showAuthSecret ? authSecret : "•••••••••••••••••••••••"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAndAuth;
