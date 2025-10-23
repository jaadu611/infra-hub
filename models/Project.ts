import { Schema, model, models } from "mongoose";

// Schema for pending invites
const pendingInviteSchema = new Schema(
  {
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["viewer", "editor"],
      default: "viewer",
    },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" },
  },
  { _id: false }
);

// Schema for storing dynamic project models
const projectModelSchema = new Schema(
  {
    name: { type: String, required: true },
    schema: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Main Project schema
const projectSchema = new Schema(
  {
    name: { type: String, required: true },

    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: ["admin", "editor", "viewer"],
          default: "viewer",
        },
      },
    ],

    invitedEmails: { type: [String], default: [] },

    pendingInvites: { type: [pendingInviteSchema], default: [] },

    apiKey: { type: String, required: true, unique: true },
    mongoUrl: { type: String, required: true },
    authSecret: { type: String, required: true },

    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],

    // NEW: Save project models with their schema
    models: { type: [projectModelSchema], default: [] },
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", projectSchema);
export default Project;
