import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  profile: String,
  role: {
    type: String,
    default: "user"
  },
  id: String
})

const User = mongoose.model("YooUser", userSchema);

export default User