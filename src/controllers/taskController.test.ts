import { Request, Response } from 'express';
import * as controller from '../../src/controllers/taskController';
import Task from '../../src/models/Task';
import * as responseUtils from '../../src/utils/response';

jest.mock('../../src/models/Task');
jest.mock('../../src/utils/response');

describe('Task Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should fetch all tasks and return success response', async () => {
      const req = {} as unknown as Request;
      const res = {} as Response;
      const mockTasks = [{ id: 1, title: 'Task 1' }];

      (Task.find as jest.Mock).mockResolvedValue(mockTasks);

      await controller.getAllTasks(req, res);

      expect(Task.find).toHaveBeenCalled();
      expect(responseUtils.success).toHaveBeenCalledWith(res, 'Tasks fetched successfully', mockTasks);
    });

    it('should handle errors and return error response', async () => {
      const req = {} as unknown as Request;
      const res = {} as Response;

      (Task.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await controller.getAllTasks(req, res);

      expect(Task.find).toHaveBeenCalled();
      expect(responseUtils.error).toHaveBeenCalledWith(res, 'Error fetching tasks');
    });
  });

  describe('createTask', () => {
    it('should create a task and return success response', async () => {
      const req = {
        body: { title: 'New Task', description: 'Description', completed: false },
      } as Request;
      const res = {} as Response;
      const mockTask = { ...req.body, save: jest.fn().mockResolvedValue(req.body) };

      (Task as unknown as jest.Mock).mockImplementation(() => mockTask);

      await controller.createTask(req, res);

      expect(mockTask.save).toHaveBeenCalled();
      expect(responseUtils.success).toHaveBeenCalledWith(res, 'Task created successfully', req.body);
    });

    it('should handle errors and return error response', async () => {
      const req = {
        body: { title: 'New Task', description: 'Description', completed: false },
      } as Request;
      const res = {} as Response;

      (Task as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      await controller.createTask(req, res);

      expect(responseUtils.error).toHaveBeenCalledWith(res, 'Error creating task');
    });
  });

  describe('updateTask', () => {
    it('should update a task and return success response', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Updated Task' },
      } as unknown as Request;
      const res = {} as Response;
      const mockUpdatedTask = { id: '1', title: 'Updated Task' };

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedTask);

      await controller.updateTask(req, res);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('1', req.body, { new: true });
      expect(responseUtils.success).toHaveBeenCalledWith(res, 'Task updated successfully', mockUpdatedTask);
    });

    it('should return error if task not found', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Updated Task' },
      } as unknown as Request;
      const res = {} as Response;

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await controller.updateTask(req, res);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('1', req.body, { new: true });
      expect(responseUtils.error).toHaveBeenCalledWith(res, 'Task not found', 404);
    });

    it('should handle errors and return error response', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Updated Task' },
      } as unknown as Request;
      const res = {} as Response;

      (Task.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      await controller.updateTask(req, res);

      expect(responseUtils.error).toHaveBeenCalledWith(res, 'Error updating task');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return success response', async () => {
      const req = {
        params: { id: '1' },
      } as unknown as Request;
      const res = {} as Response;
      const mockDeletedTask = { id: '1', title: 'Task to delete' };

      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedTask);

      await controller.deleteTask(req, res);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(responseUtils.success).toHaveBeenCalledWith(res, 'Task deleted successfully', null);
    });

    it('should return error if task not found', async () => {
      const req = {
        params: { id: '1' },
      } as unknown as Request;
      const res = {} as Response;

      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await controller.deleteTask(req, res);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(responseUtils.error).toHaveBeenCalledWith(res, 'Task not found', 404);
    });

    it('should handle errors and return error response', async () => {
      const req = {
        params: { id: '1' },
      } as unknown as Request;
      const res = {} as Response;

      (Task.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('Database error'));

      await controller.deleteTask(req, res);

      expect(responseUtils.error).toHaveBeenCalledWith(res, 'Error deleting task');
    });
  });
});
