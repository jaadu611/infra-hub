"use server";

import User from "@/models/User";
import { connectDB } from "./mongodb";
import crypto from "crypto";
import Project from "@/models/Project";
import DocumentModel from "@/models/Docs";
import Activity from "@/models/Activity";
import { Types } from "mongoose";
import APIRequest from "@/models/APIRequest";

// ------------------ Types ------------------

export interface Member {
  _id: string;
  name?: string;
  user?: { _id: string; name?: string; email?: string };
  email?: string;
  role?: "admin" | "editor" | "viewer";
}

interface UpdateProfileInput {
  name: string;
  email: string;
  company: string;
}

export interface Document {
  _id: string;
  name?: string;
  title?: string;
  content?: string;
  addedBy?: string;
  createdAt?: string;
  owner?: { _id: string; name: string; email: string };
  projectId?: string;
}

export interface ProjectDoc {
  apiRequests: number;
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
  collectionName: string;
  type:
    | "delete"
    | "join"
    | "invite"
    | "create"
    | "update"
    | "API request (GET)"
    | "API request (POST)"
    | "API request (PUT)"
    | "API request (DELETE)";
  action: string;
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
  apiRequests: number;
  recentActivity: Activity[];
  uniqueMembers: unknown;
}

export interface CreateProjectData {
  projectName: string;
  email: string;
  description: string;
  mongoUrl?: string;
  authJsSecret?: string;
}

interface PopulatedDocument {
  _id: Types.ObjectId;
  name?: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  owner?:
    | {
        _id: Types.ObjectId;
        name: string;
        email: string;
      }
    | string;
  project?:
    | {
        _id: Types.ObjectId;
        name: string;
      }
    | string;
}

export interface ProjectType {
  populate(arg0: string, arg1: string): unknown;
  apiRequests: number;
  pendingInvites: string[];
  _id: string;
  name: string;
  members?: Member[];
  invitedEmails?: string[];
  apiKey: string;
  authSecret: string;
  mongoUrl: string;
  documents?: Document[];
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

  const userDoc = (await User.findOne({ email })
    .populate({
      path: "projects",
      populate: [
        { path: "members.user", select: "name email role" },
        { path: "documents", select: "name content owner createdAt" },
      ],
    })
    .lean()) as UserType | null;

  if (!userDoc) {
    return null;
  }

  // --- 🧩 Projects
  const projects = (userDoc.projects ?? []).map((p: ProjectType) => ({
    _id: p._id.toString(),
    name: p.name,
    createdAt: p.createdAt?.toString() ?? new Date().toISOString(),
    members: p.members?.map((m: Member) => ({
      _id: m._id.toString(),
      name: m.name,
      email: m.email,
      role: m.role ?? "viewer",
      user: m.user ? { _id: m.user._id, name: m.user.name } : undefined,
    })),
    documents: p.documents?.map((d: Document) => ({
      _id: d._id.toString(),
      title: d.name ?? "Untitled",
      content: d.content ?? "",
      addedBy:
        typeof d.owner === "string"
          ? d.owner
          : (d.owner as { _id: string })?._id,
      createdAt: d.createdAt?.toString(),
      projectId: p._id.toString(),
    })),
    apiRequests: p.apiRequests ?? 0,
  }));

  // ✅ Create a unique set of members across all projects
  const allMembers = projects.flatMap((p) => p.members ?? []);
  const uniqueMembersMap = new Map<string, Member>();
  for (const member of allMembers) {
    const key = member.email ?? member._id; // prioritize email for uniqueness
    if (!uniqueMembersMap.has(key)) {
      uniqueMembersMap.set(key, member);
    }
  }
  const uniqueMembers = Array.from(uniqueMembersMap.values());

  // --- ⚙️ Fetch API Request Logs (✅ successful only, for today)
  const projectIds = projects.map((p) => p._id);
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0); // midnight UTC

  const apiRequests = await APIRequest.find({
    project: { $in: projectIds },
    status: "success",
    createdAt: { $gte: startOfDay },
  })
    .sort({ createdAt: -1 })
    .lean();

  // --- 📈 Aggregate API Request Stats
  const apiStatsByProject = projects.map((project) => {
    const requests = apiRequests.filter(
      (r) => r.project.toString() === project._id
    );

    const total = requests.length;

    // Aggregate hourly counts for the current day
    const hourlyCounts: Record<string, number> = {};
    for (const req of requests) {
      const hour = new Date(req.createdAt).toISOString().substring(11, 13); // "HH"
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    }

    return {
      projectId: project._id,
      projectName: project.name,
      totalRequests: total,
      dailyCounts: hourlyCounts,
      recentRequests: requests.map((r) => ({
        endpoint: r.endpoint,
        method: r.method,
        createdAt: r.createdAt?.toISOString(),
        responseTimeMs: r.responseTimeMs ?? null,
      })),
    };
  });

  // --- 🧾 Recent Activity
  const recentActivityDocs = await Activity.find({
    user: userDoc._id,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentActivity = recentActivityDocs.map((act) => ({
    type: act.type,
    action: act.action,
    collectionName: act.collectionName,
    time: act.createdAt?.toString() ?? new Date().toISOString(),
  }));

  const totalApiRequests = apiStatsByProject.reduce(
    (sum, p) => sum + (p.totalRequests ?? 0),
    0
  );

  return {
    user: { _id: userDoc._id.toString(), name: userDoc.name },
    projects,
    documents: projects.flatMap((p) => p.documents ?? []),
    apiRequests: totalApiRequests,
    recentActivity,
    uniqueMembers,
  };
}

// Delete project
export async function deleteProject(projectId: string, userId: string) {
  await connectDB();

  const deletedProject = await Project.findByIdAndDelete(projectId);
  if (!deletedProject) throw new Error("Project not found");

  await User.updateMany(
    { projects: projectId },
    { $pull: { projects: projectId } }
  );

  await Activity.create({
    user: userId,
    action: `Deleted project "${deletedProject.name}"`,
    collectionName: "Projects",
    type: "delete",
  });

  return { success: true };
}

// Delete project documents
export async function deleteProjectDocuments(projectId: string) {
  await connectDB();

  const project = await Project.findById(projectId)
    .select("documents members")
    .populate("members.user", "_id");

  if (!project) throw new Error("Project not found");

  const result = await DocumentModel.deleteMany({
    _id: { $in: project.documents },
  });

  const userId = project.members?.[0]?.user?._id;
  if (userId) {
    await Activity.create({
      user: userId,
      action: `Deleted ${result.deletedCount} document(s)`,
      collectionName: "Document",
      type: "delete",
    });
  }

  return { success: true, deletedCount: result.deletedCount };
}

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
    mongoUrl: mongoUrl,
    authSecret: authJsSecret ?? crypto.randomBytes(16).toString("hex"),
    apiKey: crypto.randomBytes(16).toString("hex"),
    documents: [],
    activities: [],
  });

  user.projects.push(project._id);
  await user.save();

  await Activity.create({
    user: user._id,
    action: `Created project "${projectName}"`,
    collectionName: "Projects",
    type: "create",
    time: new Date(),
  });

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

  const project = await Project.findById(id)
    .populate({ path: "members.user", select: "name email" })
    .populate({
      path: "documents",
      select: "_id name content createdAt owner",
      options: { sort: { createdAt: -1 }, limit: 3 },
      populate: { path: "owner", select: "name email" },
    });

  return project ?? null;
}

export async function inviteUserToProject(
  projectId: string,
  userId: string,
  role: "viewer" | "editor"
) {
  await connectDB();

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(20).toString("hex");

  project.invitedEmails = project.invitedEmails ?? [];
  project.pendingInvites = project.pendingInvites ?? [];

  if (!project.invitedEmails.includes(user.email)) {
    project.invitedEmails.push(user.email);
    project.pendingInvites.push({
      email: user.email,
      role,
      token,
      createdAt: new Date(),
    });
    await project.save();
  }

  return { project, token };
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

// Get document details by ID
export async function getDocumentDetails(id: string) {
  await connectDB();

  const document = (await DocumentModel.findById(id)
    .populate("owner", "name email")
    .populate("project", "_id name")
    .lean()) as PopulatedDocument | null;

  if (!document) return null;

  return {
    _id: document._id.toString(),
    name: document.name,
    content: document.content,
    createdAt: document.createdAt
      ? new Date(document.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: document.updatedAt
      ? new Date(document.updatedAt).toISOString()
      : new Date().toISOString(),
    owner:
      typeof document.owner === "object" && document.owner !== null
        ? {
            _id: document.owner._id.toString(),
            name: document.owner.name,
            email: document.owner.email,
          }
        : { _id: String(document.owner) },
    project:
      typeof document.project === "object" && document.project !== null
        ? {
            _id: document.project._id.toString(),
            name: document.project.name,
          }
        : document.project
        ? { _id: String(document.project) }
        : null,
  };
}

export async function updateProfile(data: UpdateProfileInput) {
  if (!data.name || !data.email) {
    throw new Error("Name and email are required.");
  }

  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("No file uploaded");
  }

  return { success: true, filename: file.name };
}
