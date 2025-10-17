"use client";
import React from "react";
import { Button } from "./ui/button";

interface InviteButtonProps {
  onInvite: () => void;
}

export const InviteButton: React.FC<InviteButtonProps> = ({ onInvite }) => {
  return (
    <Button
      onClick={onInvite}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      Invite Member
    </Button>
  );
};
