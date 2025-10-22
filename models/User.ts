import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    passwordResetOtp: { type: Number },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
