import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import User from '../database/models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token não fornecido' });
  }

  try {
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    const user = await User.findByPk(payload.userId);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token inválido ou expirado' });
  }
}
