import { NextRequest, NextResponse } from "next/server";
import { createProjectServer, getProjectsServer } from "@/lib/db";

export async function GET() {
  try {
    const projects = await getProjectsServer();

    const safeProjects = Array.isArray(projects) ? projects : [];

    return NextResponse.json(safeProjects);
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (data.email && !data.projectName) {
      const projects = await getProjectsServer(data.email);
      return NextResponse.json(projects);
    }

    const project = await createProjectServer(data);
    return NextResponse.json(project);
  } catch (err) {
    console.error("Error in POST /projects:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
