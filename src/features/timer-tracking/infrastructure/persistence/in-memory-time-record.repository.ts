import type { TimeRecordRepository } from '@/features/timer-tracking/application/ports/time-record.repository';
import type { TimeRecord } from '@/features/timer-tracking/domain/time-record.types';

/**
 * Creates an in-memory time record repository for development and testing.
 * Data is stored in memory and will be lost when the application restarts.
 *
 * @returns A repository implementation that stores records in memory
 */
export const createInMemoryTimeRecordRepository = (): TimeRecordRepository => {
  const records: TimeRecord[] = [];

  return {
    save: async (record) => {
      records.push(record);
      return record;
    },

    findAll: async () => {
      return [...records].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  };
};

/**
 * Singleton instance of the in-memory time record repository.
 * This ensures data persistence across the application during the session.
 */
export const timeRecordRepository = createInMemoryTimeRecordRepository();
