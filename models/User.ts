import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["admin", "viewer", "editor"],
      default: "viewer",
    },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    apiRequests: [{ type: Schema.Types.ObjectId, ref: "APIRequest" }],
    recentActivity: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
