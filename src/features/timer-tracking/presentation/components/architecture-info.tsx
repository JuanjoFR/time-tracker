export function ArchitectureInfo() {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        🏗️ Estructura Funcional
      </h3>
      <div className="space-y-2 text-sm">
        <div className="p-3 bg-purple-50 rounded-lg">
          <strong className="text-purple-700">Domain:</strong>
          <p className="text-gray-600 font-mono text-xs mt-1">
            type TimeRecord, createTimeRecord(), formatDuration()
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <strong className="text-blue-700">Application (Ports):</strong>
          <p className="text-gray-600 font-mono text-xs mt-1">
            type TimeRecordRepository (interface)
          </p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <strong className="text-green-700">Application (Use Cases):</strong>
          <p className="text-gray-600 font-mono text-xs mt-1">
            saveTimeRecordUseCase(), getAllTimeRecordsUseCase()
          </p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <strong className="text-yellow-700">Infrastructure:</strong>
          <p className="text-gray-600 font-mono text-xs mt-1">
            createInMemoryRepository() (adaptador)
          </p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <strong className="text-orange-700">Presentation:</strong>
          <p className="text-gray-600 font-mono text-xs mt-1">
            Header, TimerCard, RecordsList (React Components)
          </p>
        </div>
      </div>
    </div>
  );
}
