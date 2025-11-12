import {
  CreateTimeRecordInput,
  CreateTimeRecordSchema,
} from '@/features/timer-tracking/domain/time-record.types';
import { createTimeRecord } from '@/features/timer-tracking/domain/time-record.factory';
import { timeRecordRepository } from '@/features/timer-tracking/infrastructure/persistence/in-memory-time-record.repository';
import z from 'zod';

type Result<T> = { success: true; data: T } | { success: false; error: string };

export const saveTimeRecordUseCase = async (
  input: CreateTimeRecordInput
): Promise<Result<void>> => {
  try {
    // Validación con Zod (lanza error si falla)
    CreateTimeRecordSchema.parse(input);

    const record = createTimeRecord(input);
    await timeRecordRepository.save(record);

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', '),
      };
    }
    return { success: false, error: 'Error al guardar el registro' };
  }
};
