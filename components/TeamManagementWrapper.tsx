"use client";

import React from "react";
import TeamManagement, { Member } from "./TeamManagement";

interface WrapperProps {
  members: Member[];
  invitedEmails: string[];
  projectId: string;
  currentUserEmail?: string;
}

const TeamManagementWrapper: React.FC<WrapperProps> = ({
  members,
  invitedEmails,
  projectId,
  currentUserEmail,
}) => {
  const handleInvite = () => {
    console.log("Invite Member clicked");
  };

  return (
    <div>
      {/* Invite button */}
      <div className="flex justify-end mb-4">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleInvite}
        >
          Invite Member
        </button>
      </div>

      {/* Team Management component with all required props */}
      <TeamManagement
        members={members}
        invitedEmails={invitedEmails}
        projectId={projectId}
        currentUserEmail={currentUserEmail}
      />
    </div>
  );
};

export default TeamManagementWrapper;
