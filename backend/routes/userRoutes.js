const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * GET USER PROFILE
 * GET /api/users/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE USER PROFILE
 * PUT /api/users/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username
    };

    // ONLY add photo if present
    if (req.body.profilePhoto && req.body.profilePhoto.startsWith("data:image")) {
      updateData.profilePhoto = req.body.profilePhoto;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      user
    });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
