export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ⏱️ Cronómetro de Tareas
          </h1>
          <p className="text-gray-600">
            Arquitectura Hexagonal + Vertical Slicing (Funcional)
          </p>
        </div>

        {/* Timer Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8"></div>

        {/* Records List */}
        <div className="bg-white rounded-2xl shadow-xl p-8"></div>

        {/* Architecture Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6"></div>
      </div>
    </div>
  );
}
