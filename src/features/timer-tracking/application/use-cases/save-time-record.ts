import type { CreateTimeRecordInput } from '@/features/timer-tracking/domain/time-record.types';
import { CreateTimeRecordSchema } from '@/features/timer-tracking/domain/time-record.types';
import { createTimeRecord } from '@/features/timer-tracking/domain/time-record.factory';
import { timeRecordRepository } from '@/features/timer-tracking/infrastructure/persistence/repository.instance';
import { ZodError } from 'zod';

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const saveTimeRecordUseCase = async (
  input: CreateTimeRecordInput
): Promise<Result<void>> => {
  try {
    // Validate with Zod
    CreateTimeRecordSchema.parse(input);

    // Create domain entity
    const record = createTimeRecord(input);

    // Persist through repository
    await timeRecordRepository.save(record);

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', '),
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
