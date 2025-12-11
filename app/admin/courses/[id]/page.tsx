import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminCoursePageClient from '@/components/admin/AdminCoursePageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCoursePage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  const { id } = await params;

  return <AdminCoursePageClient id={id} />;
}
