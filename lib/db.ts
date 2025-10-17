import User from "@/models/User";
import { connectDB } from "./mongodb";
import crypto from "crypto";
import Project from "@/models/Project";
import DocumentModel from "@/models/Docs";

// ------------------ Types ------------------

export interface Member {
  _id: string;
  name?: string;
  email?: string;
  role?: "admin" | "editor" | "viewer";
}

export interface ProjectDoc {
  _id: string;
  name: string;
  members?: Member[];
  documents?: Document[];
  createdAt: string;
}

export interface Document {
  _id: string;
  name: string;
  title?: string;
  addedBy?: string;
  createdAt?: string;
  content?: string;
  ownerId?: string;
  projectId?: string;
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
  projects?: ProjectDoc[];
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

// ------------------ Functions ------------------

// Fetch dashboard data for a user
export async function getUserDashboardData(email: string) {
  await connectDB();

  const user = await User.findOne({ email })
    .populate({
      path: "projects",
      populate: [
        { path: "members", select: "name email role" },
        { path: "documents", select: "name" },
      ],
    })
    .lean();

  if (!user) return null;

  const projects: ProjectDoc[] = (user.projects ?? []).map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
    members: (p.members ?? []).map((m) => ({
      _id: m._id.toString(),
      name: m.name,
      email: m.email,
      role: m.role,
    })),
    documents: (p.documents ?? []).map((d) => ({
      _id: d._id.toString(),
      title: d.name,
      content: d.content,
      addedBy: d.owner?.toString(),
      createdAt: d.createdAt?.toISOString(),
      projectId: p._id.toString(),
    })),
  }));

  const documents: Document[] = projects.flatMap((p) => p.documents ?? []);

  const recentActivity: Activity[] = (user.recentActivity ?? [])
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  return {
    user: { _id: user._id.toString(), name: user.name },
    projects,
    documents,
    apiRequests: user.apiRequests ?? [],
    recentActivity,
  };
}

// Delete project and remove references from users
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

// Delete all documents of a project
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
    mongoUrl: mongoUrl || "no-url",
    authSecret: authJsSecret || crypto.randomBytes(16).toString("hex"),
    apiKey: crypto.randomBytes(16).toString("hex"),
    documents: [],
    activities: [],
  });

  // Initial README document
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

// Invite a user to a project
export async function inviteUserToProject(projectId: string, userId: string) {
  await connectDB();

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!project.invitedEmails) project.invitedEmails = [];
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

  const projects = await Project.find(query)
    .populate({ path: "members.user", select: "name email role" })
    .lean();

  return projects.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
    members: (p.members ?? []).map((m) => ({
      _id: m.user._id.toString(),
      name: m.user.name,
      email: m.user.email,
      role: m.role ?? "viewer",
    })),
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
