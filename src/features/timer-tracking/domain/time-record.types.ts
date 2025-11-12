import { z } from 'zod';

// Schema de validación con Zod
export const TimeRecordSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'La descripción es requerida'),
  durationInSeconds: z.number().positive('La duración debe ser mayor a 0'),
  createdAt: z.date(),
});

// Schema para crear (sin id ni fecha)
export const CreateTimeRecordSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  durationInSeconds: z.number().positive('La duración debe ser mayor a 0'),
});

// Tipos inferidos de los schemas
export type TimeRecord = z.infer<typeof TimeRecordSchema>;
export type CreateTimeRecordInput = z.infer<typeof CreateTimeRecordSchema>;
