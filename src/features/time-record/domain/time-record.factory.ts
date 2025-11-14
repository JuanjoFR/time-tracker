import type { TimeRecord, CreateTimeRecordInput } from './time-record.types';
import { CreateTimeRecordSchema } from './time-record.types';

export const createTimeRecord = (input: CreateTimeRecordInput): TimeRecord => {
  // Validate input with Zod
  const validated = CreateTimeRecordSchema.parse(input);

  return {
    id: crypto.randomUUID(),
    description: validated.description,
    durationInSeconds: validated.durationInSeconds,
    createdAt: new Date(),
  };
};
