"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Activity type
export interface Activity {
  action: string;
  collection: string;
  time: string; // ISO string or formatted
  type: "delete" | "join" | "invite" | "create" | "update";
}

// Document type
export interface Document {
  id: string;
  name: string;
  collection: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  size: number; // in bytes or KB
  metadata: Record<string, string | boolean | number>;
}

export interface Document {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  metadata: Record<string, string | boolean | number>;
  collection: string;
  size: number;
}

// Project type
export interface Project {
  documents: Document[];
  id: string;
  name: string;
  members: Pick<User, "id" | "name" | "email">[];
  invitedEmails: string[];
  createdAt: string;
}

// API request type
export interface APIRequest {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  timestamp: string;
  status: "success" | "failure";
  responseTimeMs: number;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  recentActivity: Activity[];
  documents: Document[];
  projects: Project[];
  apiRequests: APIRequest[];
}

// Context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  user: User | null;
  children: ReactNode;
}

// Provider
export const UserProvider = ({
  user: initialUser,
  children,
}: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
