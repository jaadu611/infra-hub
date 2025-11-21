import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var mongoose: {
    conn: Mongoose | null;
  };
}

const cached = global.mongoose || { conn: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const conn = await mongoose.connect(MONGODB_URI as string, {
    dbName: "infra-hub",
  });

  cached.conn = conn;
  global.mongoose = cached;
  return conn;
}
