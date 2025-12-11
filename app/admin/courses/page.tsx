import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminCoursesPageClient from '@/components/admin/AdminCoursesPageClient';

export default async function AdminCoursesPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  return <AdminCoursesPageClient />;
}
