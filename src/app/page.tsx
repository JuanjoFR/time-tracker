import { Suspense } from 'react';
import { Header } from '@/features/time-record/presentation/components/header';
import { TimerCard } from '@/features/time-record/presentation/components/timer-card';
import { RecordsList } from '@/features/time-record/presentation/components/records-list';
import { ArchitectureInfo } from '@/features/time-record/presentation/components/architecture-info';
import { getAllTimeRecordsAction } from '@/features/time-record/infrastructure/http/time-record.actions';
import { createClient } from '@/shared/infrastructure/persistence/supabase-server';

function RecordsListSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📋 Historial de Registros
      </h2>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// This is a Server Component by default in Next.js 15+
export default async function HomePage() {
  // Get current user from Supabase server client (middleware should handle creation)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Create the promise for records (don't await here)
  const recordsPromise = getAllTimeRecordsAction().then((result) =>
    result.success ? result.data : []
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Header user={user} />

        <TimerCard />

        <Suspense fallback={<RecordsListSkeleton />}>
          <RecordsList recordsPromise={recordsPromise} />
        </Suspense>

        <ArchitectureInfo />
      </div>
    </div>
  );
}
