import { Request, Response } from 'express';
import * as authService from './auth.service';
import { success, error } from '../../utils/apiResponse';

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 201);
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    return success(res, result);
  } catch (err: any) {
    return error(res, err.message, 401);
  }
}

export async function me(req: Request, res: Response) {
  return success(res, { user: req.user });
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    await authService.forgotPassword(req.body.email);
    return success(res, { message: 'E-mail de recuperação enviado.' });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    return success(res, { message: 'Senha redefinida com sucesso.' });
  } catch (err: any) {
    return error(res, err.message, 400);
  }
}
