import { Separator } from "@radix-ui/react-separator";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { InviteHeader } from "./InviteHeader";

export interface MemberUser {
  name?: string;
  email?: string;
}

export interface Member {
  user?: MemberUser;
  role?: "admin" | "editor" | "viewer";
}

interface TeamManagementProps {
  members: Member[];
  invitedEmails: string[];
  projectId: string;
  currentUserEmail?: string;
}

export default function TeamManagement({
  members,
  invitedEmails,
  projectId,
  currentUserEmail,
}: TeamManagementProps) {
  const sortedMembers = [...members].sort((a, b) => {
    const rolePriority = { admin: 0, editor: 1, viewer: 2 };
    const aRole = a.role ?? "viewer";
    const bRole = b.role ?? "viewer";
    return rolePriority[aRole] - rolePriority[bRole];
  });

  return (
    <Card className="dark:bg-gray-800/80 dark:border-gray-700 border-gray-200 shadow-xl min-h-96 py-6! gap-0">
      <CardHeader>
        <InviteHeader
          projectId={projectId}
          currentUserEmail={currentUserEmail}
          existingMembersEmails={members.map((m) => m.user?.email ?? "")}
          invitedEmails={invitedEmails}
          title="Team Management"
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Members ({members.length})</h4>

          {members.length ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {sortedMembers.map((member, index) => {
                const name = member.user?.name ?? "No Name";
                const email = member.user?.email ?? "No Email";
                const role = member.role ?? "viewer";

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 dark:border-gray-700 border-gray-300 border p-3 dark:bg-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-600 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {name[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium dark:text-white">
                        {name}
                      </span>
                      <span className="text-gray-400 text-sm">{email}</span>
                    </div>
                    <span
                      className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full uppercase ${
                        role === "admin"
                          ? "bg-purple-400 text-white"
                          : role === "editor"
                          ? "bg-emerald-400/40 text-white"
                          : "bg-gray-600 text-gray-200"
                      }`}
                    >
                      {role}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No active members</p>
          )}

          {invitedEmails.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-3">
                  Pending Invitations ({invitedEmails.length})
                </h4>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                  {invitedEmails.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600"
                    >
                      <Mail className="h-4 w-4 text-orange-600" />
                      <span className="text-white">{email}</span>
                      <Badge
                        variant="outline"
                        className="ml-auto text-orange-600"
                      >
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
