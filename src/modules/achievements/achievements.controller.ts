import { Request, Response, NextFunction } from 'express';
import * as achievementsService from './achievements.service';
import { success, error } from '../../utils/apiResponse';

export async function listAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const data = await achievementsService.listAll(userId);
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getUserAchievements(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const data = await achievementsService.getUserAchievements(userId);
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}
