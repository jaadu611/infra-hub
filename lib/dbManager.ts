/* eslint-disable @typescript-eslint/no-explicit-any */
import Project from "@/models/Project";
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

export async function getOrCreateProjectModel(
  projectId: string,
  modelName: string,
  schema: mongoose.SchemaDefinition
) {
  const conn = getProjectConnection(projectId);
  if (!conn) throw new Error("Project DB not connected");

  if (!modelCache[projectId]) modelCache[projectId] = {};

  if (modelCache[projectId][modelName]) return modelCache[projectId][modelName];

  // Create schema in project DB
  const mongooseSchema = new mongoose.Schema(schema || {}, {
    timestamps: true,
    strict: true,
  });

  const model = conn.model(modelName, mongooseSchema);
  modelCache[projectId][modelName] = model;

  // Update Project document to store model schema
  await Project.findByIdAndUpdate(
    projectId,
    {
      $push: {
        models: {
          name: modelName,
          schema: schema,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    { new: true, upsert: true }
  );

  return model;
}

/**
 * List all collections in the project DB
 */
export async function getProjectModelNames(
  projectId: string
): Promise<{ _id: string; name: string }[]> {
  const conn = getProjectConnection(projectId);
  if (!conn) throw new Error("Project DB not connected");

  const cachedModels = modelCache[projectId];
  const results: { _id: string; name: string }[] = [];

  if (cachedModels && Object.keys(cachedModels).length > 0) {
    for (const modelName of Object.keys(cachedModels)) {
      const Model = cachedModels[modelName];
      const doc = (await Model.findOne({}, "_id name").lean()) as {
        _id?: any;
      } | null;
      if (doc && doc._id != null) {
        results.push({ _id: doc._id.toString(), name: modelName });
      } else {
        // If no documents exist yet, just return name with dummy _id
        results.push({ _id: modelName, name: modelName });
      }
    }
    return results;
  }

  // If no cached models, get collections from DB
  const collections = await conn.db!.listCollections().toArray();

  for (const coll of collections) {
    const collection = conn.db!.collection(coll.name);
    const doc = await collection.findOne({}, { projection: { _id: 1 } });
    if (doc) {
      results.push({ _id: doc._id.toString(), name: coll.name });
    } else {
      results.push({ _id: coll.name, name: coll.name });
    }
  }

  return results;
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
