"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const controller = __importStar(require("../../src/controllers/taskController"));
const Task_1 = __importDefault(require("../../src/models/Task"));
const responseUtils = __importStar(require("../../src/utils/response"));
jest.mock('../../src/models/Task');
jest.mock('../../src/utils/response');
describe('Task Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllTasks', () => {
        it('should fetch all tasks and return success response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {};
            const res = {};
            const mockTasks = [{ id: 1, title: 'Task 1' }];
            Task_1.default.find.mockResolvedValue(mockTasks);
            yield controller.getAllTasks(req, res);
            expect(Task_1.default.find).toHaveBeenCalled();
            expect(responseUtils.success).toHaveBeenCalledWith(res, 'Tasks fetched successfully', mockTasks);
        }));
        it('should handle errors and return error response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {};
            const res = {};
            Task_1.default.find.mockRejectedValue(new Error('Database error'));
            yield controller.getAllTasks(req, res);
            expect(Task_1.default.find).toHaveBeenCalled();
            expect(responseUtils.error).toHaveBeenCalledWith(res, 'Error fetching tasks');
        }));
    });
    describe('createTask', () => {
        it('should create a task and return success response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { title: 'New Task', description: 'Description', completed: false },
            };
            const res = {};
            const mockTask = Object.assign(Object.assign({}, req.body), { save: jest.fn().mockResolvedValue(req.body) });
            Task_1.default.mockImplementation(() => mockTask);
            yield controller.createTask(req, res);
            expect(mockTask.save).toHaveBeenCalled();
            expect(responseUtils.success).toHaveBeenCalledWith(res, 'Task created successfully', req.body);
        }));
        it('should handle errors and return error response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { title: 'New Task', description: 'Description', completed: false },
            };
            const res = {};
            Task_1.default.mockImplementation(() => {
                throw new Error('Database error');
            });
            yield controller.createTask(req, res);
            expect(responseUtils.error).toHaveBeenCalledWith(res, 'Error creating task');
        }));
    });
    describe('updateTask', () => {
        it('should update a task and return success response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { id: '1' },
                body: { title: 'Updated Task' },
            };
            const res = {};
            const mockUpdatedTask = { id: '1', title: 'Updated Task' };
            Task_1.default.findByIdAndUpdate.mockResolvedValue(mockUpdatedTask);
            yield controller.updateTask(req, res);
            expect(Task_1.default.findByIdAndUpdate).toHaveBeenCalledWith('1', req.body, { new: true });
            expect(responseUtils.success).toHaveBeenCalledWith(res, 'Task updated successfully', mockUpdatedTask);
        }));
        it('should return error if task not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { id: '1' },
                body: { title: 'Updated Task' },
            };
            const res = {};
            Task_1.default.findByIdAndUpdate.mockResolvedValue(null);
            yield controller.updateTask(req, res);
            expect(Task_1.default.findByIdAndUpdate).toHaveBeenCalledWith('1', req.body, { new: true });
            expect(responseUtils.error).toHaveBeenCalledWith(res, 'Task not found', 404);
        }));
        it('should handle errors and return error response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { id: '1' },
                body: { title: 'Updated Task' },
            };
            const res = {};
            Task_1.default.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));
            yield controller.updateTask(req, res);
            expect(responseUtils.error).toHaveBeenCalledWith(res, 'Error updating task');
        }));
    });
    describe('deleteTask', () => {
        it('should delete a task and return success response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { id: '1' },
            };
            const res = {};
            const mockDeletedTask = { id: '1', title: 'Task to delete' };
            Task_1.default.findByIdAndDelete.mockResolvedValue(mockDeletedTask);
            yield controller.deleteTask(req, res);
            expect(Task_1.default.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(responseUtils.success).toHaveBeenCalledWith(res, 'Task deleted successfully', null);
        }));
        it('should return error if task not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { id: '1' },
            };
            const res = {};
            Task_1.default.findByIdAndDelete.mockResolvedValue(null);
            yield controller.deleteTask(req, res);
            expect(Task_1.default.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(responseUtils.error).toHaveBeenCalledWith(res, 'Task not found', 404);
        }));
        it('should handle errors and return error response', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { id: '1' },
            };
            const res = {};
            Task_1.default.findByIdAndDelete.mockRejectedValue(new Error('Database error'));
            yield controller.deleteTask(req, res);
            expect(responseUtils.error).toHaveBeenCalledWith(res, 'Error deleting task');
        }));
    });
});
