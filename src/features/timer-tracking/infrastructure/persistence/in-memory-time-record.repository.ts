import { TimeRecordRepository } from '@/features/timer-tracking/application/ports/time-record.repository';
import { TimeRecord } from '@/features/timer-tracking/domain/time-record.types';

export const createInMemoryRepository = (): TimeRecordRepository => {
  const records: TimeRecord[] = [];

  return {
    save: async (record) => {
      records.push(record);
      return record;
    },

    findAll: async () => {
      return [...records].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    },
  };
};

// Singleton
export const timeRecordRepository = createInMemoryRepository();
