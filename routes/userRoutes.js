const express = require("express");
const User = require("../models/User");
const router = express.Router();

// GET PROFILE
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE PROFILE
router.put("/:id", async (req, res) => {
  try {
    const update = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username
    };

    if (req.body.profilePhoto?.startsWith("data:image")) {
      update.profilePhoto = req.body.profilePhoto;
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true
    }).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
