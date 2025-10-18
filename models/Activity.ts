import { Schema, model, models } from "mongoose";

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, default: "No action" },
    collectionName: { type: String, default: "Unknown" },
    time: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ["delete", "join", "invite", "update", "success"],
      required: true,
    },
  },
  { timestamps: true }
);

const Activity = models.Activity || model("Activity", activitySchema);
export default Activity;
