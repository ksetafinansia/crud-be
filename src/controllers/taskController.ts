import { Request, Response } from 'express';
import Task from '../models/Task';
import { success, error } from '../utils/response';

// Get all tasks
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find();
    success(res, 'Tasks fetched successfully', tasks);
  } catch (err) {
    error(res, 'Error fetching tasks');
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, completed } = req.body;
    const newTask = new Task({ title, description, completed });
    const savedTask = await newTask.save();
    success(res, 'Task created successfully', savedTask);
  } catch (err) {
    error(res, 'Error creating task');
  }
};

// Update an existing task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      error(res, 'Task not found', 404);
      return;
    }
    success(res, 'Task updated successfully', updatedTask);
  } catch (err) {
    error(res, 'Error updating task');
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      error(res, 'Task not found', 404);
      return;
    }
    success(res, 'Task deleted successfully', null);
  } catch (err) {
    error(res, 'Error deleting task');
  }
};