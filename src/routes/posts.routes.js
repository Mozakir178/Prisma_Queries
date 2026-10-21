
const express = require("express");
const router = express.Router();
const prisma = require("../db");

// --------------------------------------------------
// Post CRUD Operations
// --------------------------------------------------

// POST /posts
router.post("/", async (req, res) => {
  try {
    const { imageUrl, caption, location } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        error: "imageUrl is required",
      });
    }

    const post = await prisma.post.create({
      data: {
        imageUrl,
        caption,
        location,
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// GET /posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// --------------------------------------------------
// Advanced Prisma Queries
// --------------------------------------------------

// GET /posts/search?value=travel
router.get("/search", async (req, res) => {
  try {
    const { value } = req.query;

    if (!value) {
      return res.status(400).json({
        error: "Search value is required",
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            caption: {
              contains: value,
              mode: "insensitive",
            },
          },
          {
            location: {
              contains: value,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// GET /posts/filter/range?min=5&max=20
router.get("/filter/range", async (req, res) => {
  try {
    const { min, max } = req.query;

    if (min === undefined || max === undefined) {
      return res.status(400).json({
        error: "min and max are required",
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        id: {
          gte: Number(min),
          lte: Number(max),
        },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// GET /posts/filter/date?after=2026-01-01
router.get("/filter/date", async (req, res) => {
  try {
    const { after } = req.query;

    if (!after || isNaN(new Date(after).getTime())) {
      return res.status(400).json({
        error: "Valid date is required",
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gt: new Date(after),
        },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// GET /posts/sort?field=id&order=desc
router.get("/sort", async (req, res) => {
  try {
    const { field = "id", order = "asc" } = req.query;

    if (
      !["id", "createdAt"].includes(field) ||
      !["asc", "desc"].includes(order)
    ) {
      return res.status(400).json({
        error: "Invalid sorting parameters",
      });
    }

    const posts = await prisma.post.findMany({
      orderBy: {
        [field]: order,
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// GET /posts/pagination?page=2&limit=5
router.get("/pagination", async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      return res.status(400).json({
        error: "Invalid pagination parameters",
      });
    }

    const posts = await prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// --------------------------------------------------
// CRUD Operations By ID
// --------------------------------------------------

// GET /posts/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: "Invalid post ID",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// PATCH /posts/:id
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { imageUrl, caption, location } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: "Invalid post ID",
      });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        imageUrl,
        caption,
        location,
      },
    });

    return res.status(200).json(post);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// DELETE /posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: "Invalid post ID",
      });
    }

    await prisma.post.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;
