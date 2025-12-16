const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      username,
      password
    });

    res.status(201).json({
      message: "Signup successful",
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
