import { Request, Response } from 'express';
import * as donationsService from './donations.service';
import { success, error } from '../../utils/apiResponse';

export async function schedule(req: Request, res: Response) {
  try {
    const donation = await donationsService.schedule(req.user!.id as string, req.body);
    return success(res, { donation }, 201);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function list(req: Request, res: Response) {
  try {
    const { status, page, limit } = req.query;
    const result = await donationsService.list(req.user!.id as string, {
      status: status as string | undefined,
      page: Math.max(parseInt(page as string) || 1, 1),
      limit: Math.min(parseInt(limit as string) || 20, 100),
    });
    return success(res, result);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const donation = await donationsService.getById(req.params.id as string, req.user!.id as string);
    return success(res, { donation });
  } catch (err: any) {
    return error(res, err.message, 404);
  }
}

export async function cancel(req: Request, res: Response) {
  try {
    const donation = await donationsService.cancel(req.params.id as string, req.user!.id as string);
    return success(res, { donation });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function complete(req: Request, res: Response) {
  try {
    const donation = await donationsService.complete(req.params.id as string);
    return success(res, { donation });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function noShow(req: Request, res: Response) {
  try {
    const donation = await donationsService.noShow(req.params.id as string);
    return success(res, { donation });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}
