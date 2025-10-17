import { Schema, model, models } from "mongoose";

const apiRequestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    endpoint: String,
    method: String,
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    status: { type: String, enum: ["success", "fail"] },
    time: { type: Date, default: Date.now },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

const APIRequest = models.APIRequest || model("APIRequest", apiRequestSchema);
export default APIRequest;
