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

export const createCauseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  patientName: z.string().optional(),
  bloodType: bloodTypeEnum,
  hospital: z.string().min(1),
  city: z.string().min(1),
  urgencyLevel: z.number().int().min(1).max(5),
  goalDonations: z.number().int().min(1),
  expiresAt: z.string(),
});

export const updateCauseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  patientName: z.string().optional(),
  bloodType: bloodTypeEnum.optional(),
  hospital: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  urgencyLevel: z.number().int().min(1).max(5).optional(),
  goalDonations: z.number().int().min(1).optional(),
  expiresAt: z.string().optional(),
});
