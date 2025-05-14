const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todo.controller');
const { validateTodoCreate, validateTodoUpdate } = require('../middleware/validators');

// GET /api/v1/todos - Get all todos
router.get('/', TodoController.getAllTodos);

// GET /api/v1/todos/:id - Get a specific todo
router.get('/:id', TodoController.getTodoById);

// POST /api/v1/todos - Create a new todo
router.post('/', validateTodoCreate, TodoController.createTodo);

// PUT /api/v1/todos/:id - Update a todo completely
router.put('/:id', validateTodoUpdate, TodoController.updateTodo);

// PATCH /api/v1/todos/:id - Update a todo partially
router.patch('/:id', validateTodoUpdate, TodoController.updateTodo);

// DELETE /api/v1/todos/:id - Delete a todo
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;