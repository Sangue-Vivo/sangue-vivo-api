import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[ERROR]', err.message);
  const status = (err as any).status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
  });
}
