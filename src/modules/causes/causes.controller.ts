import { Request, Response } from 'express';
import * as causesService from './causes.service';
import { success, error } from '../../utils/apiResponse';

export async function list(req: Request, res: Response) {
  try {
    const { status, bloodType, city, urgent, page, limit } = req.query;
    const result = await causesService.list({
      status: status as string | undefined,
      bloodType: bloodType as string | undefined,
      city: city as string | undefined,
      urgent: urgent === 'true',
      page: Math.max(parseInt(page as string) || 1, 1),
      limit: Math.min(parseInt(limit as string) || 20, 100),
    });
    return success(res, result);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getCompatible(req: Request, res: Response) {
  try {
    const causes = await causesService.getCompatible(req.user!.bloodType as string);
    return success(res, { causes });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const cause = await causesService.getById(req.params.id as string);
    return success(res, { cause });
  } catch (err: any) {
    return error(res, err.message, 404);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const cause = await causesService.create(req.body, req.user!.id as string);
    return success(res, { cause }, 201);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const cause = await causesService.update(req.params.id as string, req.body);
    return success(res, { cause });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const cause = await causesService.updateStatus(req.params.id as string, req.body.status);
    return success(res, { cause });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const cause = await causesService.updateStatus(req.params.id as string, 'EXPIRED');
    return success(res, { cause });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}
