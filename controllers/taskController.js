import Task from "../models/Task.js";

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ order: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE task
export const createTask = async (req, res) => {
  try {
    const { content, column } = req.body;

    if (!content || !column) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const task = await Task.create({
      content,
      column,
      order: Date.now(), // simple ordering
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE task (drag & drop)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
