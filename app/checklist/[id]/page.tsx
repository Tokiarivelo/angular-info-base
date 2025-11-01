import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ChecklistItemList from '@/components/ChecklistItemList';
import CreateChecklistItemForm from '@/components/CreateChecklistItemForm';

export default async function ChecklistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  const checklist = await prisma.checklist.findUnique({
    where: { id: params.id },
    include: {
      items: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!checklist) {
    notFound();
  }

  if (checklist.ownerId !== session.user.id) {
    redirect('/checklist');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/checklist"
                className="text-xl font-bold text-gray-900"
              >
                Angular Checklist
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/checklist"
                className="text-gray-700 hover:text-gray-900"
              >
                Checklists
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/checklist"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Checklists
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {checklist.title}
            </h1>
            {checklist.description && (
              <p className="text-gray-600">{checklist.description}</p>
            )}
          </div>

          <div className="mb-6">
            <CreateChecklistItemForm checklistId={checklist.id} />
          </div>

          <ChecklistItemList items={checklist.items} />
        </div>
      </div>
    </div>
  );
}
