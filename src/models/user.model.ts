import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 15,
  },
  password: {
    type: String,
    minlength: 5,
  },
});

export const User = mongoose.model("User", userSchema);
