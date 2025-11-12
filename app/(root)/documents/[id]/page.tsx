import React from "react";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import {
  FileText,
  Calendar,
  Clock,
  FolderOpen,
  Trash2,
  TrendingUp,
  User,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import Document from "@/models/Docs";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import Activity from "@/models/Activity";
import userModel from "@/models/User";

interface OwnerType {
  _id: string;
  name?: string;
  email?: string;
}

interface DocumentType {
  _id: string;
  name: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: OwnerType;
}

interface ProjectType {
  _id: string;
  name: string;
  documents: DocumentType[];
  members: { user: { email: string }; role: string }[];
  createdAt?: string;
  updatedAt?: string;
}

async function deleteDocument(formData: FormData) {
  "use server";

  const projectId = formData.get("projectId") as string;
  const documentId = formData.get("documentId") as string;
  const userEmail = formData.get("userEmail") as string;

  if (!projectId || !documentId) return;

  await connectDB();

  const project = await Project.findById(projectId);
  if (!project) return;

  project.documents = project.documents.filter(
    (doc: string) => doc.toString() !== documentId
  );
  await project.save();

  // ✅ Delete the actual document
  const deletedDoc = await Document.findByIdAndDelete(documentId);

  // ✅ Log the activity
  try {
    const user = userEmail && (await userModel.findOne({ email: userEmail }));
    await Activity.create({
      user: user?._id,
      action: `Deleted document "${deletedDoc?.name || "Untitled"}"`,
      collectionName: "Document",
      type: "delete",
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }

  // ✅ Revalidate and redirect back to the project page
  revalidatePath(`/projects/${projectId}`);
}

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  await connectDB();

  const session = await auth();
  const currentUserEmail = session?.user?.email;

  const projectData = await Project.findById(id)
    .populate({
      path: "documents",
      populate: { path: "owner", select: "_id name email" },
    })
    .lean<ProjectType | null>();

  if (!projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Project not found
          </h2>
          <p className="text-gray-500">
            The project you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  const project: ProjectType = {
    _id: projectData._id.toString(),
    name: projectData.name || "Untitled Project",
    members: projectData.members.map((m) => ({
      user: { email: m.user.email },
      role: m.role,
    })),
    createdAt: projectData.createdAt?.toString(),
    updatedAt: projectData.updatedAt?.toString(),
    documents:
      projectData.documents?.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        owner: doc.owner
          ? { ...doc.owner, _id: doc.owner._id.toString() }
          : undefined,
      })) || [],
  };

  const isAdmin = project.members.some(
    (m) => m.user.email === currentUserEmail && m.role === "admin"
  );

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <Link href={`/projects/${project._id}`}>
        <Button
          variant="outline"
          size="sm"
          className="group mb-6 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Project
        </Button>
      </Link>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3 flex-1 min-w-[250px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                <FolderOpen className="w-3 h-3" />
                Project
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-purple-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Created{" "}
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Unknown"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Updated{" "}
                  {project.updatedAt
                    ? new Date(project.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Unknown"}
                </span>
              </div>
            </div>
            <Link
              href={`/new-document/${project._id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              New Document
            </Link>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {project.documents.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
            <FileText className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            No documents yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Get started by creating your first document. Documents help you
            organize your project&apos;s information and collaborate with your
            team.
          </p>
          <Link
            href={`/new-document/${project._id}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            Create First Document
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {project.documents.map((doc) => {
            const isOwner = doc.owner?.email === currentUserEmail;
            const canDelete = isAdmin || isOwner;

            const contentLength = doc.content?.length || 0;
            const hasContent = contentLength > 0;
            const wordCount = hasContent
              ? doc.content!.split(/\s+/).filter(Boolean).length
              : 0;

            const isRecentlyUpdated =
              doc.updatedAt &&
              doc.createdAt &&
              new Date(doc.updatedAt).getTime() !==
                new Date(doc.createdAt).getTime();

            return (
              <div
                key={doc._id}
                className="group p-6 relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 overflow-hidden"
              >
                <div className="relative space-y-4">
                  {/* Document Header */}
                  <div className="flex items-start gap-3 bg-none">
                    <Link
                      href={`/documents/view/${doc._id}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-1">
                            {doc.name || "Untitled Document"}
                          </h3>
                          {isRecentlyUpdated && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                              <TrendingUp className="w-3 h-3" />
                              Recently updated
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canDelete && (
                        <form action={deleteDocument}>
                          <input
                            type="hidden"
                            name="projectId"
                            value={project._id}
                          />
                          <input
                            type="hidden"
                            name="documentId"
                            value={doc._id}
                          />
                          <button
                            type="submit"
                            title="Delete document"
                            className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Document Stats */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        hasContent
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {hasContent ? (
                        <>
                          <FileText className="w-3 h-3" />
                          {wordCount} {wordCount === 1 ? "word" : "words"}
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3" />
                          Empty
                        </>
                      )}
                    </span>

                    {hasContent && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {contentLength.toLocaleString()} chars
                      </span>
                    )}

                    {isOwner && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                        <User className="w-3 h-3" />
                        Owner
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-700"></div>

                  {/* Document Footer */}
                  <div className="space-y-3">
                    {/* Dates */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Created{" "}
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Unknown"}
                      </span>
                      {isRecentlyUpdated && (
                        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {doc.updatedAt
                            ? new Date(doc.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : ""}
                        </span>
                      )}
                    </div>

                    {/* Owner Info */}
                    {doc.owner && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {(doc.owner.name ||
                            doc.owner.email ||
                            "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                            {doc.owner.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {doc.owner.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Document Link */}
                  <Link
                    href={`/documents/view/${doc._id}`}
                    className="block w-full py-2.5 text-center text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                  >
                    View Document →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
