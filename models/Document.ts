import { Schema, model, models } from "mongoose";

const documentSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    docId: String,
    name: String,
    collection: String,
    status: { type: String, default: "active" },
    size: Number,
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Document = models.Document || model("Document", documentSchema);
export default Document;
