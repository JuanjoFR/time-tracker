import type { TimeRecord } from '@/features/time-record/domain/time-record.types';
import { timeRecordRepository } from '@/features/time-record/infrastructure/persistence/repository.instance';
import { ensureAnonymousUserUseCase } from '@/features/auth/application/use-cases/ensure-anonymous-user';
import type { Result } from './save-time-record';

export const getAllTimeRecordsUseCase = async (): Promise<
  Result<TimeRecord[]>
> => {
  try {
    // Ensure user is authenticated (create anonymous user if needed)
    const userResult = await ensureAnonymousUserUseCase();
    if (!userResult.success) {
      return {
        success: false,
        error: `Authentication failed: ${userResult.error}`,
      };
    }

    // Get records for the authenticated user
    const records = await timeRecordRepository.findAllByUser(
      userResult.data.id
    );
    return { success: true, data: records };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
