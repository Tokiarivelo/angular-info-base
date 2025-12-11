import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminPageClient from '@/components/admin/AdminPageClient';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  return <AdminPageClient />;
}
