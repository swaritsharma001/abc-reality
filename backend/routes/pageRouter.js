import express from "express";
import Page from "../models/Page.js";
import upload from "../jwt/upload.js";
import { verifyAdmin } from "../jwt/jwt.js";

const router = express.Router();

// Get Page Data
router.get("/", async (req, res) => {
  try {
    const page = await Page.findOne();
    res.status(200).json(page);
  } catch (error) {
    console.error("GET / ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

// Update Statistics
router.post("/statistics", verifyAdmin, async (req, res) => {
  try {
    const { PropertiesSold, happyClient, Experience, Satisfaction } = req.body;
    if (!PropertiesSold || !happyClient || !Experience || !Satisfaction) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const page = await Page.findOneAndUpdate(
      {},
      { PropertiesSold, happyClient, Experience, Satisfaction },
      { new: true, upsert: true }
    );

    res.status(200).json(page);
  } catch (error) {
    console.error("POST /statistics ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

// Update Contact Info
router.post("/contact", verifyAdmin, async (req, res) => {
  try {
    const { primaryEmail, supportEmail, PhoneNumber, Address } = req.body;
    console.log(req.body)
    if (!primaryEmail || !supportEmail || !PhoneNumber || !Address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const page = await Page.findOneAndUpdate(
      {},
      { primaryEmail, supportEmail, PhoneNumber, Address },
      { new: true, upsert: true }
    );

    res.status(200).json(page);
  } catch (error) {
    console.error("POST /contact ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

// Update Social Links
router.post("/links", verifyAdmin, async (req, res) => {
  try {
    const { Facebook, Instagram, Twitter, LinkedIn } = req.body;
    if (!Facebook || !Instagram || !Twitter || !LinkedIn) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const page = await Page.findOneAndUpdate(
      {},
      { Facebook, Instagram, Twitter, LinkedIn },
      { new: true, upsert: true }
    );

    res.status(200).json(page);
  } catch (error) {
    console.error("POST /links ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

// Update Site Info
router.post("/site", verifyAdmin, async (req, res) => {
  try {
    const { SiteName, HeroTitle, HeroSubtitle } = req.body;
    //console.log(req.body)
    if (!SiteName || !HeroTitle || !HeroSubtitle) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const page = await Page.findOneAndUpdate(
      {},
      { SiteName, HeroTitle, HeroSubtitle },
      { new: true, upsert: true }
    );

    res.status(200).json(page);
  } catch (error) {
    console.error("POST /site ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

// Update Hero Image
router.post("/image", verifyAdmin, upload.single("HeroImage"), async (req, res) => {
  try {
    const img = req.file?.path;
    if (!img) return res.status(400).json({ message: "Image is required" });

    const page = await Page.findOneAndUpdate(
      {},
      { HeroImage: img },
      { new: true, upsert: true }
    );

    res.status(200).json(page);
  } catch (error) {
    console.error("POST /image ERROR:", error);
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

export default router;