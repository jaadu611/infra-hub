import { Separator } from "@radix-ui/react-separator";
import { Mail, Crown, Edit3, Eye, Clock, Shield, UserX } from "lucide-react";
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

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-200 dark:border-purple-800",
    badgeColor: "bg-purple-500",
    description: "Full access and permissions",
  },
  editor: {
    label: "Editor",
    icon: Edit3,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    badgeColor: "bg-emerald-500",
    description: "Can edit and manage content",
  },
  viewer: {
    label: "Viewer",
    icon: Eye,
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-800",
    badgeColor: "bg-gray-500",
    description: "Read-only access",
  },
};

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

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleStats = () => {
    const stats = {
      admin: members.filter((m) => m.role === "admin").length,
      editor: members.filter((m) => m.role === "editor").length,
      viewer: members.filter((m) => m.role === "viewer").length,
    };
    return stats;
  };

  const stats = getRoleStats();

  return (
    <Card className="bg-white gap-0 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
      <CardHeader className="relative border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-800/30 gap-0">
        <InviteHeader
          projectId={projectId}
          currentUserEmail={currentUserEmail}
          existingMembersEmails={members.map((m) => m.user?.email ?? "")}
          invitedEmails={invitedEmails}
          title="Team Management"
        />

        <div className="grid grid-cols-3 gap-3">
          {Object.entries(roleConfig).map(([role, config]) => {
            const RoleIcon = config.icon;
            const count = stats[role as keyof typeof stats];
            return (
              <div
                key={role}
                className={`relative overflow-hidden p-4 rounded-xl border ${config.borderColor} ${config.bgColor} transition-all duration-300 hover:shadow-lg group`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {count}
                    </p>
                    <p
                      className={`text-xs font-medium ${config.textColor} mt-1`}
                    >
                      {config.label}
                      {count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div
                    className={`p-2.5 rounded-lg bg-gradient-to-br ${config.color} shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <RoleIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6 p-6">
        {/* Members Section */}
        <div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedMembers.length > 0 ? (
              sortedMembers.map((member, index) => {
                const name = member.user?.name ?? "No Name";
                const email = member.user?.email ?? "No Email";
                const role = member.role ?? "viewer";
                const config = roleConfig[role];
                const RoleIcon = config.icon;
                const isCurrentUser = email === currentUserEmail;

                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      isCurrentUser
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                        : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {/* Hover Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        {getInitials(name)}
                      </div>
                      {/* Role Badge on Avatar */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${config.badgeColor} flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md`}
                      >
                        <RoleIcon className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white truncate">
                          {name}
                        </span>
                        {isCurrentUser && (
                          <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {email}
                        </span>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${config.bgColor} border ${config.borderColor}`}
                      >
                        <RoleIcon
                          className={`w-3.5 h-3.5 ${config.textColor}`}
                        />
                        <span
                          className={`text-xs font-bold uppercase ${config.textColor}`}
                        >
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <UserX className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No team members yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-1">
                  Invite people to collaborate on this project
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Invitations Section */}
        {invitedEmails.length > 0 && (
          <>
            <Separator className="border-t border-gray-200 dark:border-gray-700" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Pending Invitations
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {invitedEmails.length} invitation
                      {invitedEmails.length !== 1 ? "s" : ""} waiting
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {invitedEmails.map((email, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border-2 border-orange-200 dark:border-orange-800/50 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Animated Mail Icon */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-orange-500 animate-ping opacity-20" />
                    </div>

                    {/* Email */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate block">
                        {email}
                      </span>
                      <span className="text-xs text-orange-600 dark:text-orange-400">
                        Invitation sent
                      </span>
                    </div>

                    {/* Pending Badge */}
                    <Badge className="bg-orange-500 text-white font-semibold px-3 py-1 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              Role Permissions
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li className="flex items-center gap-2">
                <Crown className="w-3 h-3" />
                <strong>Admins</strong> can manage all aspects of the project
              </li>
              <li className="flex items-center gap-2">
                <Edit3 className="w-3 h-3" />
                <strong>Editors</strong> can create and modify content
              </li>
              <li className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <strong>Viewers</strong> have read-only access
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
