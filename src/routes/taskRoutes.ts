import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';

const router = express.Router();

// Route to get all tasks
router.get('/tasks', getAllTasks);

// Route to create a new task
router.post('/tasks', createTask);

// Route to update an existing task
router.put('/tasks/:id', updateTask);

// Route to delete a task
router.delete('/tasks/:id', deleteTask);

export default router;