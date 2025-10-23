/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

// Types for caching
type ConnectionCache = Record<string, mongoose.Connection>;
type ModelCache = Record<string, Record<string, mongoose.Model<any>>>;

// Caches
const connectionCache: ConnectionCache = {};
export const modelCache: ModelCache = {};

/**
 * Connect to a project's MongoDB and cache it
 */
export async function connectToProjectDB(projectId: string, mongoUrl: string) {
  if (!mongoUrl || mongoUrl === "no-url") {
    throw new Error("Invalid MongoDB URL provided");
  }

  const existingConn = connectionCache[projectId];
  if (existingConn && existingConn.readyState === 1) return existingConn;

  const conn = await mongoose.createConnection(mongoUrl).asPromise();
  connectionCache[projectId] = conn;
  modelCache[projectId] = {};

  conn.on("disconnected", () => {
    console.warn(`❌ Disconnected from DB for project ${projectId}`);
    delete connectionCache[projectId];
    delete modelCache[projectId];
  });

  return conn;
}

/**
 * Get cached connection
 */
export function getProjectConnection(projectId: string) {
  return connectionCache[projectId];
}

/**
 * Create or fetch a model in the project DB
 * @param projectId
 * @param modelName
 * @param schemaDefinition Optional schema (can be empty)
 */
export function getOrCreateProjectModel(
  projectId: string,
  modelName: string,
  schemaDefinition: mongoose.SchemaDefinition
) {
  const conn = getProjectConnection(projectId);
  if (!conn) throw new Error("Project DB not connected");

  if (!modelCache[projectId]) modelCache[projectId] = {};

  // Return cached model if exists
  if (modelCache[projectId][modelName]) return modelCache[projectId][modelName];

  // Allow any fields for now
  const schema = new mongoose.Schema(schemaDefinition || {}, {
    timestamps: true,
    strict: false, // important: allow saving arbitrary fields
  });

  const model = conn.model(modelName, schema);
  modelCache[projectId][modelName] = model;

  return model;
}

/**
 * List all collections in the project DB
 */
export async function getProjectModelNames(
  projectId: string
): Promise<string[]> {
  const conn = getProjectConnection(projectId);
  if (!conn) throw new Error("Project DB not connected");

  const cachedModels = modelCache[projectId];
  if (cachedModels && Object.keys(cachedModels).length > 0)
    return Object.keys(cachedModels);

  const collections = await conn.db!.listCollections().toArray();
  return collections.map((c) => c.name);
}

// Cleanup disconnected connections every minute
setInterval(() => {
  for (const [id, conn] of Object.entries(connectionCache)) {
    if (conn.readyState !== 1) {
      delete connectionCache[id];
      delete modelCache[id];
    }
  }
}, 60 * 1000);
