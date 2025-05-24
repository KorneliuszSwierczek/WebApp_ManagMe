import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './auth';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const payload = verifyAccessToken(token);
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.sendStatus(403);
  }
}
