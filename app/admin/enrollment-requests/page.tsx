import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminEnrollmentRequestsPageClient from '@/components/admin/AdminEnrollmentRequestsPageClient';

export default async function EnrollmentRequestsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  return <AdminEnrollmentRequestsPageClient />;
}
