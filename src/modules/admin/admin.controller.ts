import { Request, Response } from 'express';
import * as adminService from './admin.service';
import { success, error } from '../../utils/apiResponse';
import { sendCsv } from '../../lib/csv';

export async function getStats(req: Request, res: Response) {
  try {
    const data = await adminService.getStats();
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getDonationsByMonth(req: Request, res: Response) {
  try {
    const data = await adminService.getDonationsByMonth();
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getBloodDistribution(req: Request, res: Response) {
  try {
    const data = await adminService.getBloodDistribution();
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getUniversityStats(req: Request, res: Response) {
  try {
    const data = await adminService.getUniversityStats();
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function getRankDistribution(req: Request, res: Response) {
  try {
    const data = await adminService.getRankDistribution();
    return success(res, data);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function exportUsers(req: Request, res: Response) {
  try {
    const data = await adminService.exportUsers();
    return sendCsv(res, data as unknown as Record<string, unknown>[], 'users.csv');
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function exportDonations(req: Request, res: Response) {
  try {
    const data = await adminService.exportDonations();
    return sendCsv(res, data as unknown as Record<string, unknown>[], 'donations.csv');
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function exportCauses(req: Request, res: Response) {
  try {
    const data = await adminService.exportCauses();
    return sendCsv(res, data as unknown as Record<string, unknown>[], 'causes.csv');
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}
