export default function WhatIsInfraHubPage() {
  return (
    <div className="mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        What is InfraHub?
      </h1>

      {/* Introduction */}
      <section className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          InfraHub is a fully integrated developer workspace designed to
          centralize all essential tools in one platform. It simplifies project
          management, authentication, collaboration, documentation, databases,
          templates, and API analytics for developers.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Instead of using multiple disconnected tools, InfraHub allows
          developers to build, manage, and monitor projects efficiently from a
          single interface.
        </p>
      </section>

      {/* High-Level Benefits */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Benefits at a Glance
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Centralized workspace with all development tools in one place</li>
          <li>Faster project setup and onboarding</li>
          <li>Streamlined collaboration with team members</li>
          <li>
            Minimal friction, allowing you to focus on coding and building
          </li>
        </ul>
      </section>
    </div>
  );
}
