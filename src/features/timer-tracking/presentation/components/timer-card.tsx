'use client';

import { useState, useEffect } from 'react';
import { Play, Square, Save } from 'lucide-react';
import { saveTimeRecordAction } from '@/features/timer-tracking/infrastructure/http/time-record.actions';
import { formatDuration } from '@/features/timer-tracking/domain/time-record.utils';

export function TimerCard() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setError('');
    setSuccessMessage('');
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const result = await saveTimeRecordAction(description, seconds);

      if (result.success) {
        setSuccessMessage('¡Registro guardado correctamente!');
        setDescription('');
        setSeconds(0);
        setIsRunning(false);

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <div className="text-6xl font-mono font-bold text-indigo-600 mb-4">
          {formatDuration(seconds)}
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={20} />
            Iniciar
          </button>

          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Square size={20} />
            Detener
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción de la tarea:
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Reunión con cliente, Desarrollo feature X..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
          disabled={isSaving}
        />

        <button
          onClick={handleSave}
          disabled={seconds === 0 || !description.trim() || isSaving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Save size={20} />
          {isSaving ? 'Guardando...' : 'Guardar Registro'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
