import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminUsersPageClient from '@/components/admin/AdminUsersPageClient/AdminUsersPageClient';

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminUsersPageClient />
      </div>
    </div>
  );
}
