"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface JoinResponse {
  message?: string;
  error?: string;
  projectId?: string;
  userId?: string;
}

interface JoinPageProps {
  searchParams: { token?: string };
  params: { id: string };
}

export default function JoinPage({ params, searchParams }: JoinPageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const joinProject = async () => {
      if (!searchParams.token) {
        setStatus("error");
        setMessage("Missing invite token.");
        return;
      }

      try {
        const res = await fetch(
          `/api/projects/${params.id}/join?token=${searchParams.token}`
        );

        const data: JoinResponse = await res.json();

        if (!res.ok || data.error) {
          setStatus("error");
          setMessage(data.error || "Failed to join project.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Successfully joined the project!");

        setTimeout(() => {
          router.push(`/projects/${params.id}`);
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Internal server error.");
      }
    };

    joinProject();
  }, [params.id, searchParams.token, router]);

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6">
      {status === "loading" && (
        <>
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
          <p className="text-gray-700 dark:text-gray-300">
            Verifying your invite...
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
          <p className="text-green-600 dark:text-green-400 font-medium">
            {message}
          </p>
          <p className="text-gray-500 mt-2">Redirecting to your project...</p>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 dark:text-red-400 font-medium">
            {message}
          </p>
          <p className="text-gray-500 mt-2">
            Please contact the project owner or try again.
          </p>
        </>
      )}
    </div>
  );
}
