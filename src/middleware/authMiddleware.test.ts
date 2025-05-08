import { Request, Response, NextFunction } from 'express';
import authMiddleware from './authMiddleware';

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

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

    authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header is missing', () => {
    req.headers = {};

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header is invalid', () => {
    req.headers = { authorization: 'Bearer invalid-token' };

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });
});