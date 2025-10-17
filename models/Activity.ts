import { Schema, model, models } from "mongoose";

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: String,
    collectionName: String,
    time: { type: Date, default: Date.now },
    type: { type: String, enum: ["create", "update", "delete", "success"] },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Activity = models.Activity || model("Activity", activitySchema);
export default Activity;
