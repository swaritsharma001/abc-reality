import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // taaki unique constraint optional field ke sath kaam kare
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String, // image ka URL
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500, // optional: 500 char limit
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;