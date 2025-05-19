const Todo = require('../models/todo.model');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Service layer for Todo business logic
 */
class TodoService {
  /**
   * Get all todos with pagination
   * @param {Object} options - Pagination options
   * @param {Number} options.page - Page number (default: 1)
   * @param {Number} options.limit - Number of items per page (default: 10)
   * @returns {Promise<Object>} - Paginated todos and metadata
   */
  static async getAllTodos(options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    
    if (page < 1) {
      throw new BadRequestError('Page must be greater than 0');
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestError('Limit must be between 1 and 100');
    }
    
    const skip = (page - 1) * limit;
    
    const [todos, total] = await Promise.all([
      Todo.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Todo.countDocuments()
    ]);
    
    return {
      todos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get a specific todo by ID
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} - Todo document
   * @throws {NotFoundError} - If todo is not found
   */
  static async getTodoById(id) {
    const todo = await Todo.findById(id);
    if (!todo) {
      throw new NotFoundError(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @returns {Promise<Object>} - Created todo document
   */
  static async createTodo(todoData) {
    const todo = new Todo(todoData);
    return todo.save();
  }

  /**
   * Update an existing todo
   * @param {string} id - Todo ID
   * @param {Object} updateData - Todo update data
   * @returns {Promise<Object>} - Updated todo document
   * @throws {NotFoundError} - If todo is not found
   */
  static async updateTodo(id, updateData) {
    const todo = await Todo.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!todo) {
      throw new NotFoundError(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Promise<boolean>} - True if deletion was successful
   * @throws {NotFoundError} - If todo is not found
   */
  static async deleteTodo(id) {
    const todo = await Todo.findByIdAndDelete(id);
    
    if (!todo) {
      throw new NotFoundError(`Todo with ID ${id} not found`);
    }
    
    return true;
  }
}

module.exports = TodoService;