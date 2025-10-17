import { Schema, model, models } from "mongoose";

const documentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Document = models.Document || model("Document", documentSchema);
export default Document;
