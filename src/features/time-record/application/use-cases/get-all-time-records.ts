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

    // Backup: If middleware didn't create user, create one now
    if (authError || !user) {
      try {
        const { data: newAuthData, error: createError } =
          await supabase.auth.signInAnonymously();
        if (createError || !newAuthData.user) {
          return {
            success: false,
            error: 'Failed to create anonymous user.',
          };
        }
        // Get records for the newly created user (will be empty array initially)
        const records = await timeRecordRepository.findAllByUser(
          newAuthData.user.id
        );
        return { success: true, data: records };
      } catch (createError) {
        console.error('Failed to create anonymous user:', createError);
        return {
          success: false,
          error: 'Authentication failed. Please try again.',
        };
      }
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
