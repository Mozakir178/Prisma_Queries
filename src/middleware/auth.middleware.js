
const router = require("express").Router();
const prisma = require("../db");
const bcrypt = require("bcrypt");

async function authMiddleware(req, res, next) {
    const {email,password} = req.body || {};

  if(!email || !password){
    return res.status(400).json({message: "both email and password required"})
  }

  const user = await prisma.user.findFirst({
    where : {email }
  });

  if(!user){
    return res.status(401).json({message : "wrong email"})
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    return res.status(401).json({message : "wrong password"})
  }
  next();
}

module.exports = authMiddleware;