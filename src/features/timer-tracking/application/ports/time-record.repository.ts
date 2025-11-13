import type { TimeRecord } from '@/features/timer-tracking/domain/time-record.types';

export type TimeRecordRepository = {
  save: (record: TimeRecord) => Promise<TimeRecord>;
  findAll: () => Promise<TimeRecord[]>;
};
