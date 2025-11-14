import type { TimeRecordRepository } from '@/features/time-record/application/ports/time-record.repository';
import type { TimeRecord } from '@/features/time-record/domain/time-record.types';
import { createClient } from '@/shared/infrastructure/persistence/supabase-server';

/**
 * Supabase PostgreSQL implementation of TimeRecordRepository
 *
 * Maps between domain TimeRecord and database time_records table:
 * - id (UUID) <-> id
 * - description (string) <-> description
 * - durationInSeconds (number) <-> duration_in_seconds
 * - createdAt (Date) <-> created_at
 * - userId (UUID string) <-> user_id
 */
export const createSupabaseRepository = (): TimeRecordRepository => {
  return {
    save: async (record: TimeRecord): Promise<TimeRecord> => {
      try {
        const supabase = await createClient();

        const { data, error } = await supabase
          .from('time_records')
          .insert({
            id: record.id,
            description: record.description,
            duration_in_seconds: record.durationInSeconds,
            created_at: record.createdAt.toISOString(),
            user_id: record.userId,
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase save error:', error);
          throw new Error(`Failed to save time record: ${error.message}`);
        }

        // Map database row back to domain model
        return {
          id: data.id,
          description: data.description,
          durationInSeconds: data.duration_in_seconds,
          createdAt: new Date(data.created_at),
          userId: data.user_id,
        };
      } catch (error) {
        console.error('Repository save error:', error);
        throw error instanceof Error
          ? error
          : new Error('Unknown error occurred while saving time record');
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findAllByUser: async (userId: string): Promise<TimeRecord[]> => {
      try {
        const supabase = await createClient();

        // RLS will automatically filter by user_id based on auth.uid()
        // userId parameter is kept for interface compliance and potential future use
        // For MVP, fetch all user records sorted by creation date (most recent first)
        const { data, error } = await supabase
          .from('time_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase findAll error:', error);
          throw new Error(`Failed to fetch time records: ${error.message}`);
        }

        // Map database rows to domain models
        return (data || []).map((row) => ({
          id: row.id,
          description: row.description,
          durationInSeconds: row.duration_in_seconds,
          createdAt: new Date(row.created_at),
          userId: row.user_id,
        }));
      } catch (error) {
        console.error('Repository findAll error:', error);
        throw error instanceof Error
          ? error
          : new Error('Unknown error occurred while fetching time records');
      }
    },
  };
};
