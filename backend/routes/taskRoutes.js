const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, date, text, priority } = req.body;

    const task = await Task.create({
      userId,
      date,
      text,
      priority
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tasks by date
router.get("/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;

    const tasks = await Task.find({ userId, date });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
