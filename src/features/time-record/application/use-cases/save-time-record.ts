import type { CreateTimeRecordInput } from '@/features/time-record/domain/time-record.types';
import { CreateTimeRecordSchema } from '@/features/time-record/domain/time-record.types';
import { createTimeRecord } from '@/features/time-record/domain/time-record.factory';
import { timeRecordRepository } from '@/features/time-record/infrastructure/persistence/repository.instance';
import { ensureAnonymousUserUseCase } from '@/features/auth/application/use-cases/ensure-anonymous-user';
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

    // Ensure user is authenticated (create anonymous user if needed)
    const userResult = await ensureAnonymousUserUseCase();
    if (!userResult.success) {
      return {
        success: false,
        error: `Authentication failed: ${userResult.error}`,
      };
    }

    // Create domain entity with user ID
    const record = createTimeRecord({
      ...input,
      userId: userResult.data.id,
    });

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
