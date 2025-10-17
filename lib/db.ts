import User from "@/models/User";
import { connectDB } from "./mongodb";
import crypto from "crypto";
import Project from "@/models/Project";
import DocumentModel from "@/models/Docs";

// ------------------ Types ------------------

export interface Member {
  _id: string;
  name?: string;
  user?: { _id: string; name?: string };
  email?: string;
  role?: "admin" | "editor" | "viewer";
}

export interface Document {
  _id: string;
  name?: string;
  title?: string;
  content?: string;
  addedBy?: string;
  createdAt?: string;
  owner?: { _id: string; name?: string } | string;
  projectId?: string;
}

export interface ProjectDoc {
  _id: string;
  name: string;
  members?: Member[];
  documents?: Document[];
  createdAt: string;
}

export interface APIRequest {
  _id: string;
  endpoint: string;
}

export interface Activity {
  type: "success" | "create" | "update" | "delete";
  action: string;
  collection: string;
  time: string;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive" | "pending";
  lastLogin?: Date;
  projects?: ProjectType[];
  recentActivity?: Activity[];
  apiRequests?: APIRequest[];
}

export interface DashboardData {
  user: { _id: string; name: string };
  projects: ProjectDoc[];
  documents: Document[];
  apiRequests: APIRequest[];
  recentActivity: Activity[];
}

export interface CreateProjectData {
  projectName: string;
  email: string;
  mongoUrl?: string;
  authJsSecret?: string;
}

export interface ProjectType {
  _id: string;
  name: string;
  members?: Member[];
  invitedEmails?: string[];
  apiKey: string;
  authSecret: string;
  mongoUrl: string;
  documents?: Document[];
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

// ------------------ Populated Types ------------------

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  role?: "admin" | "editor" | "viewer";
}

interface PopulatedMember {
  _id: string;
  name?: string;
  email?: string;
  role: "admin" | "editor" | "viewer";
  user?: PopulatedUser;
}

// ------------------ Functions ------------------

export async function getUserDashboardData(
  email: string
): Promise<DashboardData | null> {
  await connectDB();

  const userDoc = await User.findOne({ email })
    .populate({
      path: "projects",
      populate: [
        { path: "members", select: "name email role" },
        { path: "documents", select: "name content owner createdAt" },
      ],
    })
    .lean<UserType>();

  if (!userDoc) return null;

  const projects: ProjectDoc[] = (userDoc.projects ?? []).map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    createdAt: p.createdAt?.toString() ?? new Date().toISOString(),
    members: p.members?.map((m) => ({
      _id: m._id.toString(),
      name: m.name,
      email: m.email,
      role: m.role,
      user: m.user ? { _id: m.user._id, name: m.user.name } : undefined,
    })),
    documents: p.documents?.map((d) => ({
      _id: d._id.toString(),
      title: d.name ?? "Untitled",
      content: d.content ?? "",
      addedBy: typeof d.owner === "string" ? d.owner : d.owner?._id,
      createdAt: d.createdAt?.toString(),
      projectId: p._id.toString(),
    })),
  }));

  const documents: Document[] = projects.flatMap((p) => p.documents ?? []);

  const recentActivity: Activity[] = (userDoc.recentActivity ?? [])
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  return {
    user: { _id: userDoc._id.toString(), name: userDoc.name },
    projects,
    documents,
    apiRequests: userDoc.apiRequests ?? [],
    recentActivity,
  };
}

// Delete project
export async function deleteProject(projectId: string) {
  await connectDB();

  const deletedProject = await Project.findByIdAndDelete(projectId);
  if (!deletedProject) throw new Error("Project not found");

  await User.updateMany(
    { projects: projectId },
    { $pull: { projects: projectId } }
  );

  return { success: true };
}

// Delete project documents
export async function deleteProjectDocuments(projectId: string) {
  await connectDB();

  const project = await Project.findById(projectId).select("documents");
  if (!project) throw new Error("Project not found");

  const result = await DocumentModel.deleteMany({
    _id: { $in: project.documents },
  });

  return { success: true, deletedCount: result.deletedCount };
}

// Create a new project
export async function createProjectServer(data: CreateProjectData) {
  await connectDB();

  const { projectName, email, mongoUrl, authJsSecret } = data;
  if (!projectName || !email) throw new Error("Missing required fields");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const project = await Project.create({
    name: projectName,
    members: [{ user: user._id, role: "admin" }],
    invitedEmails: [],
    mongoUrl: mongoUrl ?? "no-url",
    authSecret: authJsSecret ?? crypto.randomBytes(16).toString("hex"),
    apiKey: crypto.randomBytes(16).toString("hex"),
    documents: [],
    activities: [],
  });

  const now = new Date();
  const formattedDate = now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const initialDoc = await DocumentModel.create({
    owner: user._id,
    project: project._id,
    name: `README - ${projectName}`,
    content: `# Welcome to ${projectName}\nCreated by ${user.name} on ${formattedDate}`,
  });

  project.documents.push(initialDoc._id);
  await project.save();

  user.projects.push(project._id);
  await user.save();

  return {
    _id: project._id.toString(),
    name: project.name,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    apiKey: project.apiKey,
    authSecret: project.authSecret,
    mongoUrl: project.mongoUrl,
    members: [
      {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: "admin",
      },
    ],
  };
}

// Get project by ID
export async function getProjectById(id: string) {
  await connectDB();

  const project = await Project.findById(id)
    .populate({ path: "members.user", select: "name email" })
    .populate({
      path: "documents",
      options: { sort: { createdAt: -1 }, limit: 5 },
      populate: { path: "owner", select: "name email" },
    });

  return project ?? null;
}

// Invite user to project
export async function inviteUserToProject(projectId: string, userId: string) {
  await connectDB();

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  project.invitedEmails = project.invitedEmails ?? [];
  if (!project.invitedEmails.includes(user.email)) {
    project.invitedEmails.push(user.email);
    await project.save();
  }

  return project;
}

// Get all projects for a user
export async function getProjectsServer(userEmail?: string) {
  await connectDB();

  let query = {};
  if (userEmail) query = { "members.user": await getUserIdByEmail(userEmail) };

  // Explicitly type as array
  const projects = await Project.find(query)
    .populate({ path: "members.user", select: "name email role" })
    .lean<(ProjectType & { members?: PopulatedMember[] })[]>();

  return projects.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    createdAt: p.createdAt?.toString() ?? new Date().toISOString(),
    members: p.members?.map((m) => {
      const user = m.user;
      return {
        _id: user?._id.toString() ?? "",
        name: user?.name ?? "Unknown",
        email: user && "email" in user ? user.email : "",
        role: m.role ?? "viewer",
      };
    }),
    documentsCount: Array.isArray(p.documents) ? p.documents.length : 0,
    apiKey: p.apiKey,
    mongoUrl: p.mongoUrl,
    authSecret: p.authSecret,
  }));
}

// Helper to get user ID by email
async function getUserIdByEmail(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  return user._id;
}
