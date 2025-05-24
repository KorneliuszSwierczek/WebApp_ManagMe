import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { users } from './users';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from './auth';
import { authenticateToken } from './middleware';

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req: Request, res: Response) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({ accessToken, refreshToken });
});

app.post('/api/refresh', (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const payload = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken(payload.userId);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.sendStatus(403);
  }
});

app.get('/api/me', authenticateToken, (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const user = users.find(u => u.id === userId);
  if (!user) return res.sendStatus(404);

  const { password, ...userData } = user;
  res.json(userData);
});

app.listen(3000, () => {
  console.log('API działa na http://localhost:3000');
});
