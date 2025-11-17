import type { User } from '@supabase/supabase-js';
import { SignOutButton } from '@/features/auth/presentation/components/sign-out-button';

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

            <SignOutButton />
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
