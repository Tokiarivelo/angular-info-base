import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminCourseRequestsPageClient from '@/components/admin/AdminCourseRequestsPageClient';

export default async function CourseRequestsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  return <AdminCourseRequestsPageClient />;
}
