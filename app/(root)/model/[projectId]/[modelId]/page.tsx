import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Link from "next/link";
import {
  Database,
  ArrowLeft,
  Code2,
  Sparkles,
  FileCode,
  Tag,
  Link2,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { modelCache } from "@/lib/dbManager";

interface PageProps {
  params: Promise<{ projectId: string; modelId: string }>;
}

interface Field {
  name: string;
  type: string;
  ref?: string;
}

function syntaxHighlight(json: string) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b\d+(\.\d+)?\b)/g,
    (match) => {
      let cls = "text-white"; // default
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-blue-400"; // key
        } else {
          cls = "text-green-400"; // string value
        }
      } else if (/true|false/.test(match)) {
        cls = "text-purple-400"; // boolean
      } else if (/null/.test(match)) {
        cls = "text-gray-400"; // null
      } else if (/^\d/.test(match)) {
        cls = "text-yellow-400"; // number
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

const FIELD_TYPE_STYLES: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  String: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    icon: "Aa",
  },
  Number: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    icon: "123",
  },
  Boolean: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    icon: "T/F",
  },
  Date: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    icon: "📅",
  },
  ObjectId: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-700 dark:text-pink-300",
    icon: "🔗",
  },
  Mixed: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-300",
    icon: "⚡",
  },
};

async function deleteModel(formData: FormData) {
  "use server";

  const projectId = formData.get("projectId") as string;
  const modelId = formData.get("modelId") as string;

  await connectDB();
  const project = await Project.findById(projectId);
  if (!project) return;

  project.models = project.models.filter(
    (m: { name: string }) => m.name !== modelId
  );
  await project.save();

  // 🧹 Remove from cache
  if (modelCache[projectId]?.[modelId]) {
    delete modelCache[projectId][modelId];
    if (Object.keys(modelCache[projectId]).length === 0) {
      delete modelCache[projectId];
    }
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export default async function ModelPage({ params }: PageProps) {
  const { projectId, modelId } = await params;
  await connectDB();

  const project = (await Project.findById(projectId).lean()) as {
    models: { name: string; schema: Record<string, object> }[];
  } | null;
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-200 dark:border-red-800">
          <CardContent className="p-8 text-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 w-fit mx-auto mb-4">
              <Database className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Project Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The project you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const model = project.models.find((m) => m.name === modelId);

  if (!model) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-200 dark:border-red-800">
          <CardContent className="p-8 text-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 w-fit mx-auto mb-4">
              <FileCode className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Model Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This model doesn&apos;t exist in the project.
            </p>
            <Link href={`/projects/${projectId}`}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fields: Field[] = Object.entries(model.schema).map(([key, value]) => {
    const v = value as object | { type: string; ref?: string };
    if (v && typeof v === "object" && "type" in v) {
      return { name: key, type: String(v.type), ref: v.ref };
    }
    return { name: key, type: String(value) };
  });

  return (
    <div className="min-h-screen space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-[1400px] mx-auto">
        <Link href={`/projects/${projectId}`}>
          <Button
            variant="outline"
            className="group hover:border-blue-400 dark:hover:border-blue-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Project
          </Button>
        </Link>
      </div>

      {/* Header Card */}
      <Card className="w-full max-w-[1400px] mx-auto dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-white border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-800/30 pb-6">
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {model.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Model Schema & Structure
                </p>
              </div>
            </div>

            {/* Delete Button (Server Action Form) */}
            <form action={deleteModel}>
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="modelId" value={modelId} />
              <Button
                type="submit"
                variant="destructive"
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white flex items-center gap-2 shadow-lg"
              >
                <FileCode className="w-4 h-4" />
                Delete Model
              </Button>
            </form>
          </div>
        </CardHeader>
      </Card>

      {/* Fields Card */}
      <Card className="w-full gap-0 max-w-[1400px] mx-auto dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-white border-gray-200 dark:border-gray-700 shadow-2xl">
        <CardHeader className="border-b py-6 gap-0 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Model Fields
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {fields.length} field{fields.length !== 1 ? "s" : ""} defined
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {fields.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {fields.map((field) => {
                const style =
                  FIELD_TYPE_STYLES[field.type] || FIELD_TYPE_STYLES.Mixed;
                return (
                  <div
                    key={field.name}
                    className="group relative overflow-hidden p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-purple-500 hover:shadow-lg"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />

                    <div className="relative space-y-3 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white break-words leading-tight">
                        {field.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-3 py-1.5 rounded-lg ${style.bg} ${style.text} text-xs font-semibold flex items-center gap-1.5 shadow-sm`}
                        >
                          <span className="text-sm">{style.icon}</span>
                          {field.type}
                        </span>
                        {field.ref && (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                            <Link2 className="w-3 h-3" />
                            {field.ref}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="relative p-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <Tag className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
                No Fields Defined
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-sm">
                This model doesn&apos;t have any fields defined yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* JSON Preview Card */}
      <Card className="w-full gap-0 max-w-[1400px] mx-auto dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-white border-gray-200 dark:border-gray-700 shadow-2xl">
        <CardHeader className="border-b py-6 gap-0 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Schema Definition
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Raw JSON representation
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-950 dark:to-gray-900 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs text-gray-400 font-mono">
                schema.json
              </span>
            </div>
            <pre
              className="bg-gray-900 dark:bg-gray-950 p-6 pt-12 overflow-x-auto text-sm font-mono"
              dangerouslySetInnerHTML={{
                __html: syntaxHighlight(JSON.stringify(model.schema, null, 2)),
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
