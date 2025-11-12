import { createClient } from '@/shared/infrastructure/persistence/supabase-server';

export default async function Home() {
  const supabase = await createClient();
  const { data: timeRecords } = await supabase.from('time_records').select();

  return (
    <main>
      <pre>{JSON.stringify(timeRecords, null, 2)}</pre>
    </main>
  );
}
