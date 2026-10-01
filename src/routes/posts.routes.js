const express = require("express");
const router = express.Router();
const prisma = require("../db");

// POST /posts
router.post("/", async (req, res) => {
  // TODO: Create post using Prisma
  try {
    const { imageUrl, caption, location } = req.body;
    
    const newPost = await prisma.post.create(
      {
        data: {
          imageUrl,
          caption,
          location,
        }
      }
    )
    res.status(201).json(newPost)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }

  
});


// GET /posts
router.get("/", async (req, res) => {
  // TODO: Fetch all posts
  try {
    const give = await prisma.post.findMany()
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});


// --------------------------------------------------
// Advanced Prisma Queries
// --------------------------------------------------

// Search posts by caption or location
// Example:
// GET /posts/search?caption=travel
// GET /posts/search?location=delhi
router.get("/search", async (req, res) => {
  // TODO:
  // Implement contains
  // mode: insensitive
  
  try {
    const { caption, location } = req.params
    const give = await prisma.post.findMany({
      where: {
        OR: {
          caption: {
            contains: caption,
            mode: 'insensitive'
          },
          location: {
            contains: location,
            mode: 'insensitive'
          }
        }
      }
    })
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});


// Filter posts by ID range
// Example:
// GET /posts/filter/range?min=5&max=20
router.get("/filter/range", async (req, res) => {
  // TODO:
  // Implement gte and lte
  try {
    const { min, max } = req.params
    const give = await prisma.post.findMany({
      where: {
        id: {
          OR: {
            gte: min,
            lte: max,
          }
        }
      }
    })
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});


// Filter posts created after a date
// Example:
// GET /posts/filter/date?after=2026-01-01
router.get("/filter/date", async (req, res) => {
  // TODO:
  // Implement gt with Date
  try {
    const { after } = req.params
    const give = await prisma.post.findMany({
      where: {
        createdAt: {
          gt: new Date(after)
        }
      }
    })
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});


// Sort posts
// Example:
// GET /posts/sort?field=id&order=desc
router.get("/sort", async (req, res) => {
  // TODO:
  // Implement orderBy
  try {
    const { field, order } = req.params
    const give = await prisma.post.findMany({
      orderBy: {
        [field]: order
      }
    })
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});


// Pagination
// Example:
// GET /posts/pagination?page=2&limit=5
router.get("/pagination", async (req, res) => {
  // TODO:
  // Implement skip and take
  try {
    const { page, limit } = req.params
    const give = await prisma.post.findMany({
        skip: page,
        take: limit
    })
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});



// GET /posts/:id
router.get("/:id", async (req, res) => {
  // TODO: Fetch single post
  try {
    const { id } = req.url
    const give = await prisma.post.findFirst({
      where: {
        id
      }
    })
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});


// PATCH /posts/:id
router.patch("/:id", async (req, res) => {
  // TODO: Update post
  try {
    const { id } = req.url;
    const { body } = req.body;
    const give = await prisma.post.update({
      where: id,
      data: body
    })
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});


// DELETE /posts/:id
router.delete("/:id", async (req, res) => {
  // TODO: Delete post
  try {
    const { id } = req.url
    const give = await prisma.post.delete({
      where: id
    })
    res.status(200).json(give)
  }
  catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});


module.exports = router;