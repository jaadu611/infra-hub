"use client";

export default function CreateAccountPage() {
  return (
    <div className="w-full p-6 space-y-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Getting Started with InfraHub
      </h1>

      {/* Introduction */}
      <section className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          InfraHub is a fully integrated developer workspace. This guide will
          walk you through creating your first project, setting up your
          environment, and collaborating with your team.
        </p>
      </section>

      {/* Step 1 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Step 1: Create Your First Project
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          From your dashboard, click <strong>New Project</strong>. Give your
          project a name, optionally select a template, and click{" "}
          <strong>Create</strong>. Your project workspace is ready instantly.
        </p>
      </section>

      {/* Step 2 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Step 2: Configure Your Database
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Connect a MongoDB database or create collections directly in InfraHub.
          You can browse, edit, and manage documents entirely within the
          platform—no complex setup needed.
        </p>
      </section>

      {/* Step 3 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Step 3: Invite Team Members
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Add collaborators with role-based permissions. Track activity, assign
          roles, and collaborate seamlessly within the project.
        </p>
      </section>

      {/* Step 4 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Step 4: Organize Your Documentation
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Upload Markdown files, organize folders, and preview documentation
          directly in the browser. InfraHub keeps your docs tidy and easily
          accessible.
        </p>
      </section>

      {/* Step 5 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Step 5: Make Your First API Request
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Use InfraHub’s built-in API monitoring to send requests, view logs,
          and track analytics. Visualize errors, performance, and request usage
          in real-time.
        </p>
      </section>

      {/* Tips */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Tips for a Smooth Start
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Choose meaningful project names to stay organized.</li>
          <li>Use role-based permissions for secure collaboration.</li>
          <li>Start with prebuilt templates to save time on setup.</li>
          <li>
            Monitor API requests and logs regularly to catch issues early.
          </li>
        </ul>
      </section>
    </div>
  );
}
