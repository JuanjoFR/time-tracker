import type { TimeRecord } from '@/features/time-record/domain/time-record.types';
import { timeRecordRepository } from '@/features/time-record/infrastructure/persistence/repository.instance';
import { createClient } from '@/shared/infrastructure/persistence/supabase-server';
import type { Result } from './save-time-record';

export const getAllTimeRecordsUseCase = async (): Promise<
  Result<TimeRecord[]>
> => {
  try {
    // Get current user from server client (middleware handles auth)
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // If no user exists, something is wrong with middleware
    if (authError || !user) {
      return {
        success: false,
        error: 'No authenticated user found. Please refresh the page.',
      };
    }

    // Get records for the authenticated user
    const records = await timeRecordRepository.findAllByUser(user.id);
    return { success: true, data: records };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
