
# 📘 API Standard: Request and Response Format

This document defines the standard API request and response format for a CRUD REST API built with Express and MongoDB.

---

## 📥 Request Format

### 1. Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, Bread, Eggs",
  "completed": false
}
```

### 2. Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Buy groceries and drinks",
  "completed": true
}
```

---

## 📤 Response Format

### ✅ Success Response
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "id": "663b8bb4399a4b0012345678",
    "title": "Buy groceries",
    "description": "Milk, Bread, Eggs",
    "completed": false,
    "createdAt": "2025-05-08T15:21:00.123Z",
    "updatedAt": "2025-05-08T15:21:00.123Z"
  }
}
```

### ❌ Error Response
```json
{
  "status": "error",
  "message": "Invalid request payload"
}
```

---

## 📦 Response Wrapper Structure

| Field     | Type     | Description                                |
|-----------|----------|--------------------------------------------|
| `status`  | string   | `"success"` or `"error"`                   |
| `message` | string   | Human-readable message                     |
| `data`    | object/array/null | Main data payload or null if error |

---

## 🧠 Optional Utility Wrapper (Express)

### utils/response.ts
```ts
export const success = (res, message, data) => {
  res.json({ status: "success", message, data });
};

export const error = (res, message, code = 400) => {
  res.status(code).json({ status: "error", message });
};
```

### Usage in Controller
```ts
import { success, error } from '../utils/response';

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    success(res, 'Task created successfully', task);
  } catch (err) {
    error(res, err.message);
  }
};
```
