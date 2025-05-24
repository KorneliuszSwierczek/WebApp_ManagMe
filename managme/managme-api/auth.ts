import jwt from 'jsonwebtoken';

const SECRET = 'tajny_klucz';
const REFRESH_SECRET = 'tajny_refresh';

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): any {
  return jwt.verify(token, SECRET);
}

export function verifyRefreshToken(token: string): any {
  return jwt.verify(token, REFRESH_SECRET);
}
