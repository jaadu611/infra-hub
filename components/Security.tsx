"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Copy,
  Key,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Check,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Separator } from "@radix-ui/react-separator";

interface SecurityAndAuthProps {
  apiKey: string;
  authSecret: string;
  projectId?: string;
  userRole: "admin" | "editor" | "viewer";
}

const SecurityAndAuth: React.FC<SecurityAndAuthProps> = ({
  apiKey,
  authSecret,
  userRole,
}) => {
  const [copiedField, setCopiedField] = useState<
    "apiKey" | "authSecret" | null
  >(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAuthSecret, setShowAuthSecret] = useState(false);

  const handleCopy = (value: string, field: "apiKey" | "authSecret") => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      toast.success(
        `${field === "apiKey" ? "API Key" : "Auth Secret"} copied to clipboard`
      );
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const maskValue = (value: string, showLength: number = 8) => {
    if (!value) return "••••••••••••••••••••";
    return `${value.slice(0, showLength)}${"•".repeat(
      Math.max(0, value.length - showLength)
    )}`;
  };

  const getStrength = (value: string) => {
    if (value.length > 40)
      return { label: "Strong", color: "text-green-500", bg: "bg-green-500" };
    if (value.length > 20)
      return { label: "Medium", color: "text-yellow-500", bg: "bg-yellow-500" };
    return { label: "Weak", color: "text-red-500", bg: "bg-red-500" };
  };

  const authSecretStrength = getStrength(authSecret);

  return (
    <Card className="bg-white gap-0 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
      {/* Animated Background Gradient */}

      <CardHeader className="relative border-b gap-0 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800/50 dark:to-gray-800/30 py-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl blur-lg opacity-30 animate-pulse" />
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                Security & Authentication
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your API credentials securely
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
              Secured
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6 p-6">
        {/* API Key Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Key className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  API Key
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Used to authenticate API requests
                </p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-600">
              <code className="flex-1 font-mono text-sm text-gray-900 dark:text-white break-all">
                {showApiKey ? apiKey : maskValue(apiKey)}
              </code>

              <div className="flex items-center gap-1 flex-shrink-0">
                {userRole !== "viewer" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group/btn"
                    title={showApiKey ? "Hide API Key" : "Show API Key"}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white" />
                    )}
                  </Button>
                )}

                {userRole !== "viewer" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(apiKey, "apiKey")}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all group/btn"
                    title="Copy API Key"
                  >
                    {copiedField === "apiKey" ? (
                      <Check className="h-4 w-4 text-green-500 animate-in zoom-in" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="border-t border-gray-200 dark:border-gray-700" />

        {/* Auth Secret Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Authentication Secret
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Used for JWT token signing
                </p>
              </div>
            </div>

            {/* Strength Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-4 rounded-full ${
                        i <=
                        (authSecretStrength.label === "Strong"
                          ? 3
                          : authSecretStrength.label === "Medium"
                          ? 2
                          : 1)
                          ? authSecretStrength.bg
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-medium ${authSecretStrength.color}`}
                >
                  {authSecretStrength.label}
                </span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-600">
              <code className="flex-1 font-mono text-sm text-gray-900 dark:text-white break-all">
                {showAuthSecret ? authSecret : "•".repeat(40)}
              </code>

              <div className="flex items-center gap-1 flex-shrink-0">
                {userRole !== "viewer" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthSecret(!showAuthSecret)}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group/btn"
                    title={
                      showAuthSecret ? "Hide Auth Secret" : "Show Auth Secret"
                    }
                  >
                    {showAuthSecret ? (
                      <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white" />
                    )}
                  </Button>
                )}

                {userRole !== "viewer" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(authSecret, "authSecret")}
                    className="hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all group/btn"
                    title="Copy Auth Secret"
                  >
                    {copiedField === "authSecret" ? (
                      <Check className="h-4 w-4 text-green-500 animate-in zoom-in" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover/btn:text-purple-600 dark:group-hover/btn:text-purple-400" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Auth Secret Info */}
          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-500" />
            <p>
              Use this secret to sign JWT tokens. Store it as{" "}
              <code className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-700 dark:text-purple-300 font-mono">
                JWT_SECRET
              </code>{" "}
              in your environment variables.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAndAuth;
