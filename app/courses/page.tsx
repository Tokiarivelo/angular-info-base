import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CoursesPageClientWrapper from '@/components/CoursesPageClientWrapper';

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  return <CoursesPageClientWrapper />;
}
