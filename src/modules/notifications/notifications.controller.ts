import { Request, Response, NextFunction } from 'express';
import * as notificationsService from './notifications.service';
import { success, error } from '../../utils/apiResponse';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const unreadOnly = req.query.unreadOnly === 'true';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const data = await notificationsService.list(userId, unreadOnly, page, limit);
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const data = await notificationsService.markRead(id as string, userId as string);
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function markAllRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    await notificationsService.markAllRead(userId);
    return success(res, null);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}
