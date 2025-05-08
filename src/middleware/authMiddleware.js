"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer abc123') {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return; // Ensure the function exits after sending the response
    }
    next();
};
exports.default = authMiddleware;
