const express = require("express");
const router = express.Router();
const prisma = require("../db");

// POST /posts
router.post("/", async (req, res) => {
  // TODO: Create post using Prisma
});


// GET /posts
router.get("/", async (req, res) => {
  // TODO: Fetch all posts
});


// --------------------------------------------------
// Advanced Prisma Queries
// --------------------------------------------------

// Search posts by caption or location
// Example:
// GET /posts/search?value=travel
router.get("/search", async (req, res) => {
  // TODO:
  // Implement contains
  // mode: insensitive
});


// Filter posts by ID range
// Example:
// GET /posts/filter/range?min=5&max=20
router.get("/filter/range", async (req, res) => {
  // TODO:
  // Implement gte and lte
});


// Filter posts created after a date
// Example:
// GET /posts/filter/date?after=2026-01-01
router.get("/filter/date", async (req, res) => {
  // TODO:
  // Implement gt with Date
});


// Sort posts
// Example:
// GET /posts/sort?field=id&order=desc
router.get("/sort", async (req, res) => {
  // TODO:
  // Implement orderBy
});


// Pagination
// Example:
// GET /posts/pagination?page=2&limit=5
router.get("/pagination", async (req, res) => {
  // TODO:
  // Implement skip and take
});



// GET /posts/:id
router.get("/:id", async (req, res) => {
  // TODO: Fetch single post
});


// PATCH /posts/:id
router.patch("/:id", async (req, res) => {
  // TODO: Update post
});


// DELETE /posts/:id
router.delete("/:id", async (req, res) => {
  // TODO: Delete post
});


module.exports = router;