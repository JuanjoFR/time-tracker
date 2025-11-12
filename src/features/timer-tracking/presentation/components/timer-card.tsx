import { Play, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TimeRecord } from '../../domain/time-record.types';
import { getAllTimeRecordsUseCase } from '../../application/use-cases/get-all-time-records';
import { saveTimeRecordUseCase } from '../../application/use-cases/save-time-record';
import { formatDuration } from '../../domain/time-record.utils';

export function TimerCard() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [description, setDescription] = useState('');
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Timer effect
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

  const loadRecords = async () => {
    const result = await getAllTimeRecordsUseCase();
    if (result.success) {
      setRecords(result.data);
    }
  };

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

    const result = await saveTimeRecordUseCase(description, seconds);

    if (result.success) {
      setSuccessMessage('¡Registro guardado correctamente!');
      setDescription('');
      setSeconds(0);
      setIsRunning(false);
      await loadRecords();

      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error);
    }
  };

  // Cargar registros al inicio
  useEffect(() => {
    loadRecords();
  }, []);

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
    </div>
  );
}
