import mongoose from "mongoose";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
