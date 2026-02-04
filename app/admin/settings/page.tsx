import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/shared/Header/Header';
import AdminSettings from '@/components/admin/AdminSettings/AdminSettings';

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={session.user} variant="admin" />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <AdminSettings />
      </main>
    </div>
  );
}
