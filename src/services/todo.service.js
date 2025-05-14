const Todo = require('../models/todo.model');
const { NotFoundError } = require('../utils/errors');

/**
 * Service layer for Todo business logic
 */
class TodoService {
  /**
   * Get all todos
   * @returns {Promise<Array>} - List of all todos
   */
  static async getAllTodos() {
    return Todo.find().sort({ createdAt: -1 });
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