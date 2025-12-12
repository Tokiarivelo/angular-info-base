import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChapterPageClient from '@/components/ChapterPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChapterPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const { id: chapterId } = await params;

  return <ChapterPageClient id={chapterId} />;
}
