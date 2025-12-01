import {
  KeyRound,
  LayoutGrid,
  Users,
  FileText,
  Database,
  Github,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: KeyRound,
    title: "Instant Authentication",
    description:
      "Sign up, sign in, password reset, and secure sessions instantly without external services.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: LayoutGrid,
    title: "Unified Developer Dashboard",
    description:
      "Manage all projects, see recent activity, and monitor progress from a clean, personalized dashboard.",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite members with roles and permissions to collaborate seamlessly on projects.",
    color: "text-teal-600 dark:text-teal-400",
  },
  {
    icon: FileText,
    title: "Browser-Based Documentation",
    description:
      "Organize folders, upload multiple Markdown files, and preview them directly in your browser.",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: Database,
    title: "Integrated MongoDB Explorer",
    description:
      "Access, edit, and manage MongoDB collections without any complex setup.",
    color: "text-red-600 dark:text-red-400",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description:
      "Connect GitHub, import repositories, and sync project workflows effortlessly.",
    color: "text-gray-900 dark:text-white",
  },
  {
    icon: LayoutGrid,
    title: "Prebuilt Project Templates",
    description:
      "Kickstart development with ready-to-use templates for common stacks and workflows.",
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: BarChart3,
    title: "API Analytics & Monitoring",
    description:
      "Track every API request with built-in logs and graph-based visual insights.",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: KeyRound,
    title: "Environment Variables Manager",
    description:
      "Securely manage and update environment variables for all your projects in one place.",
    color: "text-orange-600 dark:text-orange-400",
  },
];

export default function CoreFeaturesPage() {
  return (
    <div className="w-full p-6 space-y-12">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
        Core Features at a Glance
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow hover:shadow-lg transition"
            >
              <Icon className={`w-10 h-10 mb-4 ${feature.color}`} />
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
