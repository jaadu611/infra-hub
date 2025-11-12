"use client";

import React, { useState } from "react";
import {
  Users,
  X,
  Search,
  Loader2,
  ChevronDown,
  UserPlus,
  Mail,
  Shield,
  Edit3,
  Eye,
  CheckCircle,
  AlertCircle,
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

const roleConfig = {
  editor: {
    label: "Editor",
    icon: Edit3,
    description: "Can edit and manage content",
    color: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  viewer: {
    label: "Viewer",
    icon: Eye,
    description: "Read-only access",
    color: "from-gray-500 to-slate-500",
    textColor: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
};

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
  const [inviting, setInviting] = useState<string | null>(null);
  const [invitedEmailsState, setInvitedEmailsState] =
    useState<string[]>(invitedEmails);
  const [selectedRole, setSelectedRole] = useState<"editor" | "viewer">(
    "viewer"
  );

  const config = roleConfig[selectedRole];
  const RoleIcon = config.icon;

  // --- Search users ---
  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      setResults([]);
      return;
    }
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
    } catch (err) {
      toast.error("Failed to search users");
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Invite user ---
  const handleInvite = async (user: User) => {
    if (inviting) return;
    setInviting(user._id);
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
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>
            Invited <strong>{user.name}</strong> as {config.label}
          </span>
        </div>
      );
      setResults((prev) => prev.filter((u) => u._id !== user._id));
      setInvitedEmailsState((prev) => [...prev, user.email]);
    } catch (err) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>
            {err instanceof Error ? err.message : "Failed to send invite"}
          </span>
        </div>
      );
    } finally {
      setInviting(null);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-30 animate-pulse" />
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="py-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {title || "Team Management"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Collaborate with your team members
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
        >
          <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Invite Member
        </Button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none rounded-2xl" />

            {/* Modal Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-30" />
                  <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Invite Team Member
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    Add someone to collaborate on this project
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
              >
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="relative p-6 space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Shield className="w-4 h-4" />
                  Select Permission Role
                </label>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${config.borderColor} ${config.bgColor} flex items-center justify-between group`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}
                        >
                          <RoleIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {config.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {config.description}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-[--radix-dropdown-menu-trigger-width] gap-2 flex flex-col bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2"
                  >
                    {Object.entries(roleConfig).map(([role, conf]) => {
                      const Icon = conf.icon;
                      return (
                        <DropdownMenuItem
                          key={role}
                          onSelect={() =>
                            setSelectedRole(role as "editor" | "viewer")
                          }
                          className={`rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                            selectedRole === role
                              ? `${conf.bgColor} ${conf.borderColor} border-2`
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div
                            className={`flex items-center w-full ${
                              selectedRole === role && "justify-between"
                            } gap-3`}
                          >
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-br ${conf.color}`}
                            >
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {conf.label}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {conf.description}
                              </p>
                            </div>
                            {selectedRole === role && (
                              <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Search className="w-4 h-4" />
                  Search Users
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                    />
                    {loading && (
                      <Loader2 className="absolute right-4 h-5 w-5 animate-spin text-blue-600 dark:text-blue-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-3">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-blue-600 dark:border-blue-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
                      Searching for users...
                    </p>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Found {results.length} user
                      {results.length !== 1 ? "s" : ""}
                    </p>
                    {results.map((user, index) => (
                      <div
                        key={user._id}
                        className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform`}
                            >
                              {getInitials(user.name)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleInvite(user)}
                          disabled={inviting === user._id}
                          className={`ml-4 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 bg-gradient-to-r ${config.color} text-white`}
                        >
                          {inviting === user._id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Inviting...
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Invite as {config.label}
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty States */}
                {!loading && search && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                        <Search className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No users found
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
                      We couldn&apos;t find anyone matching &quot;{search}
                      &quot;. Try a different search term.
                    </p>
                  </div>
                )}

                {!loading && !search && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <Search className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Start searching
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
                      Type a name or email address to find team members you want
                      to invite.
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
