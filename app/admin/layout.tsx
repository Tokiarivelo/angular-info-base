import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/shared/Header/Header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/courses');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header user={session.user} variant="admin" />
      <div className="max-w-7xl mx-auto pt-24 pb-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">{children}</div>
      </div>
    </div>
  );
}
