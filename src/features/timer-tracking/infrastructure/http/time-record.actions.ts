'use server';

import { saveTimeRecordUseCase } from '@/features/timer-tracking/application/use-cases/save-time-record';
import { getAllTimeRecordsUseCase } from '@/features/timer-tracking/application/use-cases/get-all-time-records';

export async function saveTimeRecordAction(
  description: string,
  durationInSeconds: number
) {
  return await saveTimeRecordUseCase({ description, durationInSeconds });
}

export async function getAllTimeRecordsAction() {
  return await getAllTimeRecordsUseCase();
}
