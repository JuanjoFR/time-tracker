import type { CreateTimeRecordInput } from '@/features/time-record/domain/time-record.types';
import { CreateTimeRecordSchema } from '@/features/time-record/domain/time-record.types';
import { createTimeRecord } from '@/features/time-record/domain/time-record.factory';
import { timeRecordRepository } from '@/features/time-record/infrastructure/persistence/repository.instance';
import { createClient } from '@/shared/infrastructure/persistence/supabase-server';
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
            error: 'Failed to create anonymous user for saving records.',
          };
        }
        // Use the newly created user
        const record = createTimeRecord({
          ...input,
          userId: newAuthData.user.id,
        });
        await timeRecordRepository.save(record);
        return { success: true, data: undefined };
      } catch (createError) {
        console.error('Failed to create anonymous user:', createError);
        return {
          success: false,
          error: 'Authentication failed. Please try again.',
        };
      }
    }

    // Create domain entity with user ID
    const record = createTimeRecord({
      ...input,
      userId: user.id,
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
