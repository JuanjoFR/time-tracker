import { z } from 'zod';

export const CreateTimeRecordSchema = z.object({
  description: z.string().min(1, 'Description is required').trim(),
  durationInSeconds: z.number().positive('Duration must be greater than 0'),
});

export const TimeRecordSchema = z.object({
  id: z.string(),
  description: z.string(),
  durationInSeconds: z.number(),
  createdAt: z.date(),
  userId: z.string().uuid('User ID must be a valid UUID'),
});

export type CreateTimeRecordInput = z.infer<typeof CreateTimeRecordSchema>;
export type TimeRecord = z.infer<typeof TimeRecordSchema>;
