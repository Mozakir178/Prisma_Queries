const express = require("express");
const router = express.Router();
const prisma = require("../db");
const authMiddleware = require("../middleware/auth.middleware");

// POST /profiles - Create a profile for an existing user
router.post("/", async (req, res) => {
  try {
    const { bio, userId } = req.body;

    if (!bio || !userId) {
      return res.status(400).json({
        message: "Bio and userId are required",
      });
    }

    const profile = await prisma.profile.create({
      data: {
        bio,
        user: {
          connect: {
            id: Number(userId),
          },
        },
      },
      include: {
        user: true,
      },
    });

    return res.status(201).json(profile);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "User already has a profile",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// GET /profiles - Retrieve all profiles with users
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        user: true,
      },
    });

    return res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;