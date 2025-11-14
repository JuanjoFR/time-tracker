'use server';

import { revalidatePath } from 'next/cache';
import { saveTimeRecordUseCase } from '@/features/time-record/application/use-cases/save-time-record';
import { getAllTimeRecordsUseCase } from '@/features/time-record/application/use-cases/get-all-time-records';

export async function saveTimeRecordAction(
  description: string,
  durationInSeconds: number
) {
  const result = await saveTimeRecordUseCase({
    description,
    durationInSeconds,
  });

  // Revalidate to show new data
  revalidatePath('/');

  return result;
}

export async function getAllTimeRecordsAction() {
  return await getAllTimeRecordsUseCase();
}
