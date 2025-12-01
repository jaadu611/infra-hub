"use client";

import { Lock } from "lucide-react";

export default function CLIPage() {
  return (
    <div className="w-full p-6 space-y-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        InfraHub CLI
      </h1>

      {/* Introduction */}
      <section className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          The InfraHub CLI allows you to interact with your projects
          programmatically via API calls. Currently, the CLI supports
          authenticating users against your project models.
        </p>
      </section>

      {/* 1️⃣ Login Command */}
      <section className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md space-y-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Login
          </h2>
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Authenticate a user against a specific project model using email and
          password. Upon successful login, a JWT token is issued and stored in a
          secure cookie.
        </p>

        {/* Endpoint */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Endpoint
          </h3>
          <pre className="bg-gray-900 text-gray-100 dark:bg-gray-800 dark:text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            POST https://infra-hub.onrender.com/api/client/login
          </pre>
        </div>

        {/* Headers */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Headers
          </h3>
          <pre className="bg-gray-900 text-gray-100 dark:bg-gray-800 dark:text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            x-api-key: YOUR_PROJECT_API_KEY{"\n"}Content-Type: application/json
          </pre>
        </div>

        {/* Request Body */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Request Body
          </h3>
          <pre className="bg-gray-900 text-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            <code>
              {"{\n"}
              {'  "modelName": "User", '}
              <span className="text-gray-400 dark:text-gray-500">
                # Name of the model to store the user in
              </span>
              {"\n"}
              {'  "email": "user@example.com", '}
              <span className="text-gray-400 dark:text-gray-500">
                # User&apos;s email address
              </span>
              {"\n"}
              {'  "password": "yourPassword123!" '}
              <span className="text-gray-400 dark:text-gray-500">
                User&apos;s password
              </span>
              {"\n"}
              {"}"}
            </code>
          </pre>
        </div>

        {/* Response */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Response (Success)
          </h3>
          <pre className="bg-gray-900 text-gray-100 dark:bg-gray-800 dark:text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            {`{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "name": "User Name"
  }
}`}
          </pre>
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          CLI Command: <code>infra login</code> — this wraps the API call and
          stores the JWT token for future authenticated commands.
        </p>
      </section>

      {/* Notes */}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Notes
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          <li>Ensure your API key is valid for the target project.</li>
          <li>
            Passwords must match the ones stored in the project&apos;s model.
          </li>
          <li>
            All login attempts are logged for audit and debugging purposes.
          </li>
          <li>Use HTTPS for all API calls to ensure secure communication.</li>
        </ul>
      </section>
    </div>
  );
}
