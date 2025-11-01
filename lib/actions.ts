'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createChecklist(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const checklist = await prisma.checklist.create({
    data: {
      title,
      description: description || null,
      ownerId: session.user.id,
    },
  });

  revalidatePath('/checklist');
  return checklist;
}

export async function deleteChecklist(checklistId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const checklist = await prisma.checklist.findUnique({
    where: { id: checklistId },
  });

  if (!checklist || checklist.ownerId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.checklist.delete({
    where: { id: checklistId },
  });

  revalidatePath('/checklist');
}

export async function createChecklistItem(
  checklistId: string,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const checklist = await prisma.checklist.findUnique({
    where: { id: checklistId },
  });

  if (!checklist || checklist.ownerId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const notes = formData.get('notes') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const itemCount = await prisma.checklistItem.count({
    where: { checklistId },
  });

  const item = await prisma.checklistItem.create({
    data: {
      checklistId,
      title,
      notes: notes || null,
      order: itemCount,
    },
  });

  revalidatePath(`/checklist/${checklistId}`);
  return item;
}

export async function toggleChecklistItem(itemId: string, done: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const item = await prisma.checklistItem.findUnique({
    where: { id: itemId },
    include: { checklist: true },
  });

  if (!item || item.checklist.ownerId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.checklistItem.update({
    where: { id: itemId },
    data: { done },
  });

  revalidatePath(`/checklist/${item.checklistId}`);
}

export async function updateChecklistItem(
  itemId: string,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const item = await prisma.checklistItem.findUnique({
    where: { id: itemId },
    include: { checklist: true },
  });

  if (!item || item.checklist.ownerId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const notes = formData.get('notes') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  await prisma.checklistItem.update({
    where: { id: itemId },
    data: {
      title,
      notes: notes || null,
    },
  });

  revalidatePath(`/checklist/${item.checklistId}`);
}

export async function deleteChecklistItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const item = await prisma.checklistItem.findUnique({
    where: { id: itemId },
    include: { checklist: true },
  });

  if (!item || item.checklist.ownerId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.checklistItem.delete({
    where: { id: itemId },
  });

  revalidatePath(`/checklist/${item.checklistId}`);
}
