"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("./authMiddleware"));
describe('authMiddleware', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    it('should call next if authorization header is valid', () => {
        req.headers = { authorization: 'Bearer abc123' };
        (0, authMiddleware_1.default)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
    it('should return 401 if authorization header is missing', () => {
        req.headers = {};
        (0, authMiddleware_1.default)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });
    it('should return 401 if authorization header is invalid', () => {
        req.headers = { authorization: 'Bearer invalid-token' };
        (0, authMiddleware_1.default)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });
});
