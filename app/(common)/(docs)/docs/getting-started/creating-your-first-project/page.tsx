"use client";

export default function CreateProjectPage() {
  return (
    <div className="w-full p-6 space-y-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Creating Your First Project
      </h1>

      {/* Introduction */}
      <section className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Once you have your InfraHub account, creating a project is fast and
          easy. A project is the central workspace where you manage your code,
          databases, API requests, documentation, templates, and team
          collaboration.
        </p>
      </section>

      {/* Step 1 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Step 1: Start a New Project
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          From your dashboard, click the <strong>New Project</strong> button.
          Enter a descriptive project name and optionally select a template to
          get started quickly.
        </p>
      </section>

      {/* Step 2 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Step 2: Configure Project Settings
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          After creating the project, access project settings to configure:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Project name, description, and visibility</li>
          <li>Environment variables for APIs or services</li>
          <li>Database connections</li>
          <li>Team roles and permissions</li>
        </ul>
      </section>

      {/* Step 3 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Step 3: Start Working in Your Project
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Your project dashboard gives you access to:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Documentation editor and Markdown preview</li>
          <li>MongoDB Explorer to manage collections</li>
          <li>API requests and analytics</li>
          <li>Team collaboration tools</li>
          <li>Templates and GitHub integration</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Everything is in one place, so you can focus on building rather than
          switching tools.
        </p>
      </section>

      {/* Tips */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Tips for Your First Project
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Pick a meaningful project name to stay organized.</li>
          <li>Invite teammates early to collaborate efficiently.</li>
          <li>
            Set up environment variables and database connections before coding.
          </li>
        </ul>
      </section>
    </div>
  );
}
