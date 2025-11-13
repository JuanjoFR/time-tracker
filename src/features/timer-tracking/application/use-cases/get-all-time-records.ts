import type { TimeRecord } from '@/features/timer-tracking/domain/time-record.types';
import { timeRecordRepository } from '@/features/timer-tracking/infrastructure/persistence/in-memory-time-record.repository';
import type { Result } from './save-time-record';

export const getAllTimeRecordsUseCase = async (): Promise<
  Result<TimeRecord[]>
> => {
  try {
    const records = await timeRecordRepository.findAll();
    return { success: true, data: records };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
