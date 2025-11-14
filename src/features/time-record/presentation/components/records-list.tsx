'use client';

import { use } from 'react';
import type { TimeRecord } from '@/features/time-record/domain/time-record.types';
import {
  formatDuration,
  formatDate,
} from '@/features/time-record/domain/time-record.utils';

type RecordsListProps = {
  recordsPromise: Promise<TimeRecord[]>;
};

export function RecordsList({ recordsPromise }: RecordsListProps) {
  const records = use(recordsPromise);

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📋 Historial de Registros
        </h2>
        <p className="text-gray-500 text-center py-8">
          No hay registros aún. ¡Comienza a trackear tu tiempo!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📋 Historial de Registros
      </h2>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {record.description}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(record.createdAt)}
              </p>
            </div>
            <div className="text-2xl font-mono font-bold text-indigo-600">
              {formatDuration(record.durationInSeconds)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
