import express from "express";
import Team from "../models/Team.js";
import upload from "../jwt/upload.js";
import { verifyAdmin } from "../jwt/jwt.js";

const router = express.Router();

/**
 * @route   GET /team
 * @desc    Get all team members
 */
router.get("/", async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.status(200).json(team);
  } catch (error) {
    console.error("GET /team ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

/**
 * @route   POST /team
 * @desc    Add new team member
 */
router.post("/", verifyAdmin, upload.single("img"), async (req, res) => {
  try {
    const { name, email, phone, role, bio } = req.body;
    const img = req.file?.path || "";

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email, and role are required" });
    }

    const newMember = new Team({
      name,
      email,
      phone,
      role,
      img,
      bio,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    console.error("POST /team ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

/**
 * @route   PUT /team/:id
 * @desc    Update team member
 */
router.put("/:id", verifyAdmin, upload.single("img"), async (req, res) => {
  try {
    const { name, email, phone, role, bio } = req.body;
    const img = req.file?.path;

    const updateData = { name, email, phone, role, bio };
    if (img) updateData.img = img;

    const updatedMember = await Team.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("PUT /team/:id ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

/**
 * @route   DELETE /team/:id
 * @desc    Delete team member
 */
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedMember = await Team.findByIdAndDelete(req.params.id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("DELETE /team/:id ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

export default router;