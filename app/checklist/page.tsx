import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChecklistPageClient from '@/components/ChecklistPageClient';

export default async function ChecklistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  return <ChecklistPageClient user={session.user} />;
}
