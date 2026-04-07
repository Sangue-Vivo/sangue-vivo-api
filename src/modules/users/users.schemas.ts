import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().optional(),
  university: z.string().optional(),
  course: z.string().optional(),
});
