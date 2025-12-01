import {
  CheckCircle,
  Users,
  FileText,
  Github,
  Database,
  BarChart3,
  LayoutGrid,
  KeyRound,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Everything You Need in One Developer Workspace
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16 text-lg">
          InfraHub brings authentication, databases, documentation, analytics,
          collaboration, and project management together—so you can build, test,
          and ship faster without switching tools.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Feature Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <KeyRound className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Instant Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Fully integrated auth system providing instant signup, login,
              logout, password resets, and secure sessions—all without external
              services.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> No
                configuration required
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Built-in
                session + security
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Dev-ready
                instantly
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <LayoutGrid className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Unified Developer Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage all your projects in one place with a clean, fast,
              personalized dashboard designed for productivity.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Recent
                activity timeline
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Quick project
                switching
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Clean and
                modern UI
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <Users className="w-10 h-10 text-teal-600 dark:text-teal-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Team Collaboration
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Work with teammates effortlessly using secure, role-based project
              access.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Member
                invitations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Role-based
                permissions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Activity
                tracking
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <FileText className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Browser-Based Documentation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Organize and preview all your Markdown files without leaving the
              platform.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Multi-file
                support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Real-time
                preview
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Organized
                workspace
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <Database className="w-10 h-10 text-red-600 dark:text-red-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Integrated MongoDB Explorer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Access, edit, and manage your MongoDB collections with zero setup.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Edit & browse
                documents
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> No external
                tools required
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Fast
                debugging workflow
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <Github className="w-10 h-10 text-gray-900 dark:text-white mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              GitHub Integration
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect your GitHub to instantly sync repositories and streamline
              your coding workflow.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Import repos
                instantly
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Auto-sync
                project metadata
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Works
                seamlessly with teams
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <LayoutGrid className="w-10 h-10 text-pink-600 dark:text-pink-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Prebuilt Project Templates
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start fast with ready-to-use templates for common stacks and
              workflows.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Choose from
                multiple templates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> One-click
                project creation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Standardized
                setups
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <BarChart3 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              API Analytics & Monitoring
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Track every API request using built-in visual analytics and
              request history.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Graph-based
                usage insights
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Error +
                performance tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> No
                configuration needed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
