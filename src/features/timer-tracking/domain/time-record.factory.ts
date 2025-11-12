import {
  TimeRecord,
  CreateTimeRecordInput,
  CreateTimeRecordSchema,
} from './time-record.types';

export const createTimeRecord = (input: CreateTimeRecordInput): TimeRecord => {
  // Validación con Zod
  const validated = CreateTimeRecordSchema.parse(input);

  return {
    id: crypto.randomUUID(),
    description: validated.description.trim(),
    durationInSeconds: validated.durationInSeconds,
    createdAt: new Date(),
  };
};
