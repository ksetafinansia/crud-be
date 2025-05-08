import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== 'Bearer abc123') {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return; // Ensure the function exits after sending the response
  }

  next();
};

export default authMiddleware;