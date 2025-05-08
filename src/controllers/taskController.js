"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getAllTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const response_1 = require("../utils/response");
// Get all tasks
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.find();
        (0, response_1.success)(res, 'Tasks fetched successfully', tasks);
    }
    catch (err) {
        (0, response_1.error)(res, 'Error fetching tasks');
    }
});
exports.getAllTasks = getAllTasks;
// Create a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, completed } = req.body;
        const newTask = new Task_1.default({ title, description, completed });
        const savedTask = yield newTask.save();
        (0, response_1.success)(res, 'Task created successfully', savedTask);
    }
    catch (err) {
        (0, response_1.error)(res, 'Error creating task');
    }
});
exports.createTask = createTask;
// Update an existing task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedTask = yield Task_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTask) {
            (0, response_1.error)(res, 'Task not found', 404);
            return;
        }
        (0, response_1.success)(res, 'Task updated successfully', updatedTask);
    }
    catch (err) {
        (0, response_1.error)(res, 'Error updating task');
    }
});
exports.updateTask = updateTask;
// Delete a task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTask = yield Task_1.default.findByIdAndDelete(id);
        if (!deletedTask) {
            (0, response_1.error)(res, 'Task not found', 404);
            return;
        }
        (0, response_1.success)(res, 'Task deleted successfully', null);
    }
    catch (err) {
        (0, response_1.error)(res, 'Error deleting task');
    }
});
exports.deleteTask = deleteTask;
