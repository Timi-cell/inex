const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    // Get Token
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login.");
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      res.status(401);
      throw new Error("Not authorized, please login.");
    }
    
    // Get User from token
    const user = await User.findById(verified._id);
    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login.");
  }
});

module.exports = protect;
