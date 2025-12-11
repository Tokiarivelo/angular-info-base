import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChecklistDetailClient from '@/components/ChecklistDetailClient';

export default async function ChecklistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  const { id } = await params;

  return <ChecklistDetailClient id={id} />;
}
