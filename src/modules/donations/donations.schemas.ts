import { z } from 'zod';

export const scheduleDonationSchema = z.object({
  scheduledDate: z.string(),
  hospital: z.string().min(1),
  city: z.string().min(1),
  causeId: z.string().optional(),
});
