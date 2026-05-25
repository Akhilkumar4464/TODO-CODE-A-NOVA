import { Task } from '../models/Task.model.js';

// Fetch all tasks for the logged-in user, sorted by position ascending
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ position: 1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching tasks', error: error.message });
  }
};

// Create a new task, calculating the position as max(position) + 1
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Find the current highest position to append the task at the end
    const lastTask = await Task.findOne({ userId: req.user.id }).sort({ position: -1 });
    const position = lastTask ? lastTask.position + 1 : 0;

    const task = new Task({
      userId: req.user.id,
      title,
      description,
      dueDate,
      priority,
      status,
      position,
    });

    await task.save();
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating task', error: error.message });
  }
};

// Update a task by ID
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove immutable fields if present
    delete updates.userId;
    delete updates._id;

    // Check if task exists and belongs to the user
    const task = await Task.findOne({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    // If changing due date or title/description, reset reminderSent to false
    if (updates.dueDate && new Date(updates.dueDate).getTime() !== new Date(task.dueDate).getTime()) {
      updates.reminderSent = false;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating task', error: error.message });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting task', error: error.message });
  }
};

// Bulk reorder tasks
export const reorderTasks = async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds)) {
      return res.status(400).json({ message: 'taskIds array is required' });
    }

    const bulkOps = taskIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, userId: req.user.id },
        update: { $set: { position: index } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    return res.status(200).json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error reordering tasks', error: error.message });
  }
};
