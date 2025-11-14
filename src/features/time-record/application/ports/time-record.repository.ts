import type { TimeRecord } from '@/features/time-record/domain/time-record.types';

export type TimeRecordRepository = {
  save: (record: TimeRecord) => Promise<TimeRecord>;
  findAllByUser: (userId: string) => Promise<TimeRecord[]>;
};
