"use client";

import React, { useState } from "react";
import {
  Plus,
  Users,
  X,
  Search,
  Loader2,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface InviteHeaderProps {
  projectId: string;
  title?: string;
  existingMembersEmails?: string[];
  invitedEmails?: string[];
  currentUserEmail?: string;
}

export const InviteHeader: React.FC<InviteHeaderProps> = ({
  projectId,
  title,
  existingMembersEmails = [],
  invitedEmails = [],
  currentUserEmail,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [invitedEmailsState, setInvitedEmailsState] =
    useState<string[]>(invitedEmails);
  const [selectedRole, setSelectedRole] = useState<"viewer" | "editor">(
    "viewer"
  );

  // --- Search users ---
  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) return setResults([]);
    setLoading(true);
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      const filtered = data.filter(
        (user) =>
          user.email !== currentUserEmail &&
          !existingMembersEmails.includes(user.email) &&
          !invitedEmailsState.includes(user.email)
      );
      setResults(filtered);
      setLoading(false);
    } catch {
      setResults([]);
      setLoading(false);
    }
  };

  // --- Invite user ---
  const handleInvite = async (user: User) => {
    if (inviting) return;
    setInviting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, role: selectedRole }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to send invite");
      }
      toast.success(`Invite sent to ${user.name} as ${selectedRole}`);
      setResults((prev) => prev.filter((u) => u._id !== user._id));
      setInvitedEmailsState((prev) => [...prev, user.email]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invite");
    } finally {
      setInviting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title || "Team Management"}
          </h2>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Invite Team Member
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Role
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none flex justify-between items-center transition-all duration-300 ease-in-out">
                      {selectedRole === "viewer"
                        ? "Viewer - Can view only"
                        : "Editor - Can edit and manage"}
                      <ChevronRightIcon className="ml-2 h-4 w-4 text-gray-400 dark:text-gray-300 rotate-90 transition-transform" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-1 mt-1"
                    style={
                      {
                        "--radix-dropdown-menu-trigger-width": "100%",
                      } as React.CSSProperties
                    }
                  >
                    <DropdownMenuItem
                      onSelect={() => setSelectedRole("viewer")}
                      className={
                        selectedRole === "viewer"
                          ? "bg-blue-500 text-white"
                          : ""
                      }
                    >
                      Viewer - Can view only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSelectedRole("editor")}
                      className={
                        selectedRole === "editor"
                          ? "bg-blue-500 text-white"
                          : ""
                      }
                    >
                      Editor - Can edit and manage
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-500" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Searching...
                  </span>
                </div>
              )}

              {/* Results List */}
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {!loading && results.length > 0 && (
                  <div className="space-y-2">
                    {results.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleInvite(user)}
                          disabled={inviting}
                          className="ml-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          {inviting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Invite"
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty States */}
                {!loading && results.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {search
                        ? "No users found"
                        : "Start typing to search for users"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {search
                        ? "Try a different search term"
                        : "Search by name or email address"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
