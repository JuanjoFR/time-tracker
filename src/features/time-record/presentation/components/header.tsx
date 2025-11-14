import type { User } from '@supabase/supabase-js';
import { signOutAction } from '@/features/auth/infrastructure/http/auth.actions';

type HeaderProps = {
  user: User | null;
};

export function Header({ user }: HeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        ⏱️ Cronómetro de Tareas
      </h1>
      <p className="text-gray-600">Arquitectura Hexagonal + Vertical Slicing</p>

      {/* Authentication status */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
        {user ? (
          <div className="text-green-700">
            <span className="text-sm">✅ Autenticado como:</span>
            <p className="font-medium">{user.email || 'Usuario anónimo'}</p>
            <p className="text-xs text-gray-500 mb-3">ID: {user.id}</p>

            <form action={signOutAction}>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Cerrar Sesión
              </button>
            </form>
          </div>
        ) : (
          <div className="text-blue-700">
            <p className="text-sm">
              🔄 Creando usuario anónimo automáticamente...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
