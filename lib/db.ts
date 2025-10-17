import User from "@/models/User";
import { connectDB } from "./mongodb";
import crypto from "crypto";
import Project from "@/models/Project";
import Document from "@/models/Docs";

// ------------------ Types ------------------

export interface Member {
  _id: string;
  name?: string;
  email?: string;
  role?: "admin" | "editor" | "viewer";
}

export interface Project {
  _id: string;
  name: string;
  members?: Member[];
  createdAt: string;
}

export interface Document {
  createdAt: string;
  name: string;
  addedBy: any;
  _id: string;
  title: string;
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
  projects?: Project[];
}

export interface DashboardData {
  user: { _id: string; name: string };
  projects: Project[];
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
  activities?: any[];
  createdAt: string;
  updatedAt: string;
}

// ------------------ Functions ------------------

export async function getUserDashboardData(
  email: string
): Promise<DashboardData | null> {
  await connectDB();

  const user = await User.findOne({ email })
    .populate({
      path: "projects",
      populate: [
        { path: "members", select: "name email role" },
        { path: "documents", select: "name" }, // populate documents here
      ],
    })
    .lean();

  if (!user) return null;

  // Map projects
  const projects: Project[] = (user.projects ?? []).map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
    members: (p.members ?? []).map((m: any) => ({
      _id: m._id.toString(),
      name: m.name,
      email: m.email,
      role: m.role,
    })),
    documents: (p.documents ?? []).map((d: any) => ({
      _id: d._id.toString(),
      title: d.name,
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

export async function deleteProject(projectId: string) {
  await connectDB();

  const deletedProject = await Project.findByIdAndDelete(projectId);
  if (!deletedProject) {
    throw new Error("Project not found");
  }

  await User.updateMany(
    { projects: projectId },
    { $pull: { projects: projectId } }
  );

  return { success: true };
}

export async function deleteProjectDocuments(projectId: string) {
  await connectDB();

  const result = await Document.deleteMany({ projectId });

  return { success: true, deletedCount: result.deletedCount };
}

export async function createProjectServer(
  data: CreateProjectData
): Promise<ProjectType> {
  await connectDB();

  const { projectName, email, mongoUrl, authJsSecret } = data;

  if (!projectName || !email) throw new Error("Missing required fields");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const project = await Project.create({
    name: projectName,
    members: [
      {
        user: user._id,
        role: "admin",
      },
    ],
    invitedEmails: [],
    mongoUrl: mongoUrl || "no-url",
    authSecret: authJsSecret || crypto.randomBytes(16).toString("hex"),
    apiKey: crypto.randomBytes(16).toString("hex"),
    documents: [],
    activities: [],
  });

  // ✅ Create an initial document dynamically
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

  const initialDocName = `README - ${projectName}`;
  const ownerName = user.name || "Project Owner";
  const ownerEmail = user.email || "No email available";

  const initialContent = `# 📘 Welcome to "${projectName}"

This is the initial document for your new project.

---

### 👤 Created By
**${ownerName}**  
📧 ${ownerEmail}

---

### 🕒 Created On
${formattedDate}

---

### 📝 About
This document was automatically generated when your project was created.  
You can use it as a starting point to organize notes, ideas, or summaries related to this project.

> ℹ️ Documents cannot be edited or deleted — only viewed for reference.
`;

  const initialDoc = await Document.create({
    owner: user._id,
    project: project._id,
    name: initialDocName,
    content: initialContent,
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

export async function getProjectById(id: string) {
  await connectDB();
  let project;

  try {
    project = await Project.findById(id)
      .populate({
        path: "members.user",
        select: "name email",
      })
      .populate({
        path: "documents",
        options: { sort: { createdAt: -1 }, limit: 5 },
        populate: { path: "owner", select: "name email" },
      });
  } catch (err) {
    console.error("Error fetching project:", err);
    throw err;
  }

  if (!project) {
    return null;
  }

  return project;
}

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

export async function getProjectsServer(userEmail?: string) {
  await connectDB();

  try {
    let query = {};
    if (userEmail) {
      query = { "members.user": await getUserIdByEmail(userEmail) };
    }

    const projects = await Project.find(query)
      .populate({ path: "members.user", select: "name email role" })
      .lean();

    return projects.map((p: any) => ({
      _id: p._id.toString(),
      name: p.name,
      createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
      members: (p.members ?? []).map((m: any) => ({
        _id: m.user?._id?.toString() ?? "",
        name: m.user?.name ?? "Unknown",
        email: m.user?.email ?? "Unknown",
        role: m.role ?? "viewer",
      })),
      documentsCount: Array.isArray(p.documents) ? p.documents.length : 0,
      apiKey: p.apiKey,
      mongoUrl: p.mongoUrl,
      authSecret: p.authSecret,
    }));
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw new Error("Failed to load projects");
  }
}

async function getUserIdByEmail(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  return user._id;
}
