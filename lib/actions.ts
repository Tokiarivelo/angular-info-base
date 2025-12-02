'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseFile } from '@/lib/fileParser';

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

export async function createChecklistFromFile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;
  const file = formData.get('file') as File | null;

  if (!file) {
    throw new Error('File is required');
  }

  const fileName = file.name;
  const content = await file.text();

  if (!content.trim()) {
    throw new Error('File is empty');
  }

  // Parse the file content
  const parsedChecklist = parseFile(content, fileName);

  // Create the checklist with items in a transaction
  const checklist = await prisma.$transaction(async (tx) => {
    const newChecklist = await tx.checklist.create({
      data: {
        title: parsedChecklist.title,
        description: parsedChecklist.description,
        ownerId: userId,
      },
    });

    // Create all items
    if (parsedChecklist.items.length > 0) {
      await tx.checklistItem.createMany({
        data: parsedChecklist.items.map((item, index) => ({
          checklistId: newChecklist.id,
          title: item.title,
          notes: item.notes,
          order: index,
        })),
      });
    }

    return newChecklist;
  });

  revalidatePath('/checklist');
  return checklist;
}

// Chapter Progress Actions
export async function updateChapterProgress(
  chapterId: string,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;
  const repositoryUrl = formData.get('repositoryUrl') as string;
  const websiteUrl = formData.get('websiteUrl') as string;

  const progress = await prisma.userChapterProgress.upsert({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    update: {
      repositoryUrl: repositoryUrl || null,
      websiteUrl: websiteUrl || null,
    },
    create: {
      userId,
      chapterId,
      repositoryUrl: repositoryUrl || null,
      websiteUrl: websiteUrl || null,
      completed: false,
    },
  });

  revalidatePath(`/courses/chapter/${chapterId}`);
  return progress;
}

export async function addScreenshotToProgress(
  chapterId: string,
  screenshotUrl: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const progress = await prisma.userChapterProgress.upsert({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    update: {
      screenshotUrls: {
        push: screenshotUrl,
      },
    },
    create: {
      userId,
      chapterId,
      screenshotUrls: [screenshotUrl],
      completed: false,
    },
  });

  revalidatePath(`/courses/chapter/${chapterId}`);
  return progress;
}

export async function removeScreenshotFromProgress(
  chapterId: string,
  screenshotUrl: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const existingProgress = await prisma.userChapterProgress.findUnique({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
  });

  if (!existingProgress) {
    throw new Error('Progress record not found');
  }

  const updatedUrls = existingProgress.screenshotUrls.filter(
    (url) => url !== screenshotUrl
  );

  const progress = await prisma.userChapterProgress.update({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    data: {
      screenshotUrls: updatedUrls,
    },
  });

  revalidatePath(`/courses/chapter/${chapterId}`);
  return progress;
}

export async function toggleChapterCompletion(
  chapterId: string,
  completed: boolean
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const progress = await prisma.userChapterProgress.upsert({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    update: {
      completed,
    },
    create: {
      userId,
      chapterId,
      completed,
    },
  });

  revalidatePath(`/courses/chapter/${chapterId}`);
  return progress;
}
