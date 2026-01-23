'use server';

import { prisma } from '@/lib/prisma';

export async function updateChapter(
  chapterId: string,
  data: {
    title?: string;
    description?: string;
    content?: any;
    introText?: string;
    imageUrl?: string;
    proTips?: any;
    instructions?: any;
    livePreviewUrl?: string;
  }
) {
  try {
    const updated = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    console.log('updated :>> ', updated);

    return { success: true, chapter: updated };
  } catch (error) {
    console.error('Error updating chapter:', error);
    return { success: false, error: 'Failed to update chapter' };
  }
}

export async function createChapter(
  courseId: string,
  data: {
    title: string;
    description?: string;
    content?: any;
    imageUrl?: string;
    introText?: string;
    proTips?: any;
    instructions?: any;
    livePreviewUrl?: string;
  }
) {
  try {
    // Get the highest order to append the new chapter
    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastChapter ? lastChapter.order + 1 : 1;

    const newChapter = await prisma.chapter.create({
      data: {
        courseId,
        ...data,
        order: newOrder,
      },
    });

    return { success: true, chapter: newChapter };
  } catch (error) {
    console.error('Error creating chapter:', error);
    return { success: false, error: 'Failed to create chapter' };
  }
}
