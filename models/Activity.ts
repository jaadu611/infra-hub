import { Schema, model, models } from "mongoose";

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, default: "No action" },
    collectionName: { type: String, default: "Unknown" },
    time: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ["delete", "join", "invite", "create"],
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expires: "0s" },
    },
  },
  { timestamps: true }
);

const Activity = models.Activity || model("Activity", activitySchema);
export default Activity;
