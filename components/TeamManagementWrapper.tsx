"use client";

import React from "react";
import TeamManagement, { Member } from "./TeamManagement";

interface WrapperProps {
  members: Member[];
  invitedEmails: string[];
}

const TeamManagementWrapper: React.FC<WrapperProps> = ({
  members,
  invitedEmails,
}) => {
  const handleInvite = () => {
    console.log("Invite Member clicked");
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleInvite}
        >
          Invite Member
        </button>
      </div>
      <TeamManagement members={members} invitedEmails={invitedEmails} />
    </div>
  );
};

export default TeamManagementWrapper;
