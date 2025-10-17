"use client";

import React, { useState } from "react";
import { Plus, Users, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

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

  // ------------------ Search users ------------------
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
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Invite user ------------------
  const handleInvite = async (user: User) => {
    if (inviting) return;
    setInviting(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to send invite");
      }

      toast.success(`Invite sent to ${user.name} (${user.email})`);
      setResults((prev) => prev.filter((u) => u._id !== user._id));
      setInvitedEmailsState((prev) => [...prev, user.email]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invite");
    } finally {
      setInviting(false);
    }
  };

  // ------------------ Render ------------------
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Users className="h-5 w-5 text-green-600" />
          {title || "Team Management"}
        </h2>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600/50 hover:bg-indigo-700/50 text-white px-3 py-1 rounded flex items-center gap-1"
        >
          <Plus />
          Invite Member
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4">Invite Member</h3>

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full p-2 mb-4 rounded border border-gray-600 bg-gray-800 text-white"
            />

            {loading && <p className="text-gray-400">Searching...</p>}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded"
                >
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleInvite(user)}
                    disabled={inviting}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                  >
                    Invite
                  </Button>
                </div>
              ))}
              {!loading && results.length === 0 && (
                <p className="text-gray-400 text-sm">
                  {search ? "No users found." : "Type to search for users."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
