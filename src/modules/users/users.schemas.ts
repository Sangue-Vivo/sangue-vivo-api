import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().optional(),
  university: z.string().optional(),
  course: z.string().optional(),
});

const strongPassword = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos 1 letra maiúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos 1 número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos 1 caractere especial');

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: strongPassword,
});
