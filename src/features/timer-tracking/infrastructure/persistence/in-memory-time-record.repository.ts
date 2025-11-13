import type { TimeRecordRepository } from '@/features/timer-tracking/application/ports/time-record.repository';
import type { TimeRecord } from '@/features/timer-tracking/domain/time-record.types';

export const createInMemoryRepository = (): TimeRecordRepository => {
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
