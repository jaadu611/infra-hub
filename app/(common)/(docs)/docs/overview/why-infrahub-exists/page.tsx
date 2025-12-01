export default function WhyInfraHubExistsPage() {
  return (
    <div className="mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Why InfraHub Exists
      </h1>

      {/* Problem Statement */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          The Problem
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Modern development often requires juggling multiple tools and
          services. Developers spend hours switching between dashboards,
          configuring authentication, managing databases, tracking project
          activity, and integrating third-party services. This fragmentation
          slows down development and introduces friction in workflows.
        </p>
      </section>

      {/* Frustrations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Common Frustrations
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
          <li>Time wasted switching between multiple dashboards and tools.</li>
          <li>Complex setup for authentication and secure sessions.</li>
          <li>Difficulty in tracking team activity and project analytics.</li>
          <li>Managing databases without proper in-browser tools.</li>
          <li>Fragmented collaboration between team members.</li>
        </ul>
      </section>

      {/* Solution */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Our Solution
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          InfraHub was designed to eliminate all these pain points. It provides
          a fully integrated developer workspace that combines authentication,
          project management, collaboration, documentation, databases,
          templates, analytics, and GitHub integration—all in one platform. This
          eliminates context switching, reduces setup time, and streamlines
          development workflows.
        </p>
      </section>

      {/* Benefits */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Key Benefits
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
          <li>
            <strong>Faster Development:</strong> Focus on building, not setup.
          </li>
          <li>
            <strong>Streamlined Collaboration:</strong> Role-based access and
            team activity tracking.
          </li>
          <li>
            <strong>Unified Management:</strong> Projects, docs, and databases
            in a single dashboard.
          </li>
          <li>
            <strong>Better Insights:</strong> Track API requests, monitor
            performance, and view analytics.
          </li>
        </ul>
      </section>
    </div>
  );
}
