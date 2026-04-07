import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';
import { success, error } from '../../utils/apiResponse';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getProfile(req.user!.id);
    return success(res, { user });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.updateProfile(req.user!.id, req.body);
    return success(res, { user });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getRanking(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const result = await usersService.getRanking(page, limit);
    return success(res, result);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}
