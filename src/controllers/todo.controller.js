const TodoService = require('../services/todo.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller for Todo endpoints
 */
class TodoController {
  /**
   * Get all todos
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getAllTodos(req, res, next) {
    try {
      const todos = await TodoService.getAllTodos();
      return res.status(200).json(
        ApiResponse.success(todos, 'Todos retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a todo by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getTodoById(req, res, next) {
    try {
      const todo = await TodoService.getTodoById(req.params.id);
      return res.status(200).json(
        ApiResponse.success(todo, 'Todo retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new todo
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createTodo(req, res, next) {
    try {
      const todo = await TodoService.createTodo(req.body);
      return res.status(201).json(
        ApiResponse.success(todo, 'Todo created successfully', 201)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a todo
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateTodo(req, res, next) {
    try {
      const todo = await TodoService.updateTodo(req.params.id, req.body);
      return res.status(200).json(
        ApiResponse.success(todo, 'Todo updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a todo
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteTodo(req, res, next) {
    try {
      await TodoService.deleteTodo(req.params.id);
      return res.status(200).json(
        ApiResponse.success(null, 'Todo deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodoController;