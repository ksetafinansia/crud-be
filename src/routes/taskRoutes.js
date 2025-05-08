"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const router = express_1.default.Router();
// Route to get all tasks
router.get('/tasks', taskController_1.getAllTasks);
// Route to create a new task
router.post('/tasks', taskController_1.createTask);
// Route to update an existing task
router.put('/tasks/:id', taskController_1.updateTask);
// Route to delete a task
router.delete('/tasks/:id', taskController_1.deleteTask);
exports.default = router;
