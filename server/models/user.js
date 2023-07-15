import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String },
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("User", userSchema);