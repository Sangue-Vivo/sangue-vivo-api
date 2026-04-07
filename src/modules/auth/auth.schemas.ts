import { z } from 'zod';

const bloodTypeEnum = z.enum([
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
]);

const genderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);

const strongPassword = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos 1 letra maiúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos 1 número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos 1 caractere especial');

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  cpf: z.string().min(11),
  password: strongPassword,
  bloodType: bloodTypeEnum,
  gender: genderEnum,
  birthDate: z.string(),
  university: z.string(),
  course: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: strongPassword,
});
