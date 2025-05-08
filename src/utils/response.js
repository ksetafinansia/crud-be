"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
const success = (res, message, data) => {
    res.json({ status: "success", message, data });
};
exports.success = success;
const error = (res, message, code = 400) => {
    res.status(code).json({ status: "error", message });
};
exports.error = error;
