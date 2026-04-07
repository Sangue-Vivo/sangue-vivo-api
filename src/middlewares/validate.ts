import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const issues = (result.error as any).issues || (result.error as any).errors || [];
      const message = issues.map((e: any) => e.message).join(', ') || 'Dados inválidos';
      return res.status(400).json({ success: false, error: message });
    }
    (req as any)[source] = result.data;
    next();
  };
}
