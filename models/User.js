import mongoose, { models } from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
    watchList: { type: Array, default: [] },
    favoriteList: { type: Array, default: [] },
    provider: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = models?.User || mongoose.model("User", userSchema);

export default User;
