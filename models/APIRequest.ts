import { Schema, model, models } from "mongoose";

const apiRequestSchema = new Schema(
  {
    // 🔹 Linked references
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // user might not exist for public API calls
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // 🔹 Request info
    endpoint: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      required: true,
    },

    // 🔹 Result info
    status: {
      type: String,
      enum: ["success", "failure"],
      required: true,
    },
    statusCode: {
      type: Number,
      default: 200,
    },
    responseTimeMs: {
      type: Number, // latency tracking
      default: 0,
    },

    // 🔹 Request + Response data
    requestBody: {
      type: Schema.Types.Mixed, // supports JSON objects
      default: {},
    },
    responseBody: {
      type: Schema.Types.Mixed,
      default: {},
    },
    headers: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // 🔹 Context metadata
    ipAddress: {
      type: String,
      default: "Unknown IP",
    },
    userAgent: {
      type: String,
      default: "Unknown Agent",
    },

    // 🔹 Custom metadata for app logic
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const APIRequest = models.APIRequest || model("APIRequest", apiRequestSchema);

export default APIRequest;
