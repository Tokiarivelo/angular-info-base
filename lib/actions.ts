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
  url: string,
  publicId?: string,
  caption?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Ensure progress record exists
  const progress = await prisma.userChapterProgress.upsert({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    update: {},
    create: {
      userId,
      chapterId,
      completed: false,
    },
  });

  // Create screenshot record
  const screenshot = await prisma.screenshot.create({
    data: {
      url,
      publicId,
      caption,
      userId,
      progressId: progress.id,
    },
  });

  revalidatePath(`/courses/chapter/${chapterId}`);
  return { progress, screenshot };
}

export async function removeScreenshotFromProgress(
  screenshotId: string,
  chapterId: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Verify ownership
  const screenshot = await prisma.screenshot.findUnique({
    where: { id: screenshotId },
  });

  if (!screenshot || screenshot.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Delete from database
  await prisma.screenshot.delete({
    where: { id: screenshotId },
  });

  // Optionally delete from Cloudinary if publicId exists
  if (screenshot.publicId) {
    try {
      await fetch(
        `/api/upload?publicId=${encodeURIComponent(screenshot.publicId)}`,
        {
          method: 'DELETE',
        }
      );
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', error);
      // Continue even if Cloudinary deletion fails
    }
  }

  revalidatePath(`/courses/chapter/${chapterId}`);
  return screenshot;
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

// Quiz Actions
export async function submitQuiz(
  quizId: string,
  answers: number[]
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Get quiz with questions
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: 'asc' } } },
  });

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // Calculate score
  let correctCount = 0;
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;

  // Save submission
  const submission = await prisma.quizSubmission.create({
    data: {
      userId,
      quizId,
      answers,
      score,
      passed,
    },
  });

  revalidatePath(`/courses/chapter/${quiz.chapterId}`);
  return { submission, quiz };
}

// Admin Actions - Course Management
export async function createCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const course = await prisma.course.create({
    data: {
      title,
      description: description || null,
    },
  });

  revalidatePath('/admin/courses');
  return course;
}

export async function updateCourse(courseId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      title,
      description: description || null,
    },
  });

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${courseId}`);
  return course;
}

export async function deleteCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidatePath('/admin/courses');
}

// Admin Actions - Chapter Management
export async function createChapter(courseId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const livePreviewUrl = formData.get('livePreviewUrl') as string;
  const order = formData.get('order') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const chapter = await prisma.chapter.create({
    data: {
      courseId,
      title,
      description: description || null,
      content: content || null,
      livePreviewUrl: livePreviewUrl || null,
      order: order ? parseInt(order) : 0,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
  return chapter;
}

export async function updateChapter(chapterId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const livePreviewUrl = formData.get('livePreviewUrl') as string;
  const order = formData.get('order') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const chapter = await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      title,
      description: description || null,
      content: content || null,
      livePreviewUrl: livePreviewUrl || null,
      order: order ? parseInt(order) : undefined,
    },
  });

  revalidatePath(`/admin/courses/${chapter.courseId}`);
  revalidatePath(`/courses/chapter/${chapterId}`);
  return chapter;
}

export async function deleteChapter(chapterId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
  });

  if (!chapter) {
    throw new Error('Chapter not found');
  }

  await prisma.chapter.delete({
    where: { id: chapterId },
  });

  revalidatePath(`/admin/courses/${chapter.courseId}`);
}

// Admin Actions - Quiz Management
export async function createQuiz(chapterId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const passingScore = formData.get('passingScore') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const quiz = await prisma.quiz.create({
    data: {
      chapterId,
      title,
      description: description || null,
      passingScore: passingScore ? parseInt(passingScore) : 70,
    },
  });

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/chapter/${chapterId}`);
  return quiz;
}

export async function updateQuiz(quizId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const passingScore = formData.get('passingScore') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const quiz = await prisma.quiz.update({
    where: { id: quizId },
    data: {
      title,
      description: description || null,
      passingScore: passingScore ? parseInt(passingScore) : undefined,
    },
  });

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/chapter/${quiz.chapterId}`);
  return quiz;
}

export async function deleteQuiz(quizId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  await prisma.quiz.delete({
    where: { id: quizId },
  });

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/chapter/${quiz.chapterId}`);
}

export async function createQuizQuestion(quizId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const question = formData.get('question') as string;
  const optionsJson = formData.get('options') as string;
  const correctAnswer = formData.get('correctAnswer') as string;
  const explanation = formData.get('explanation') as string;
  const order = formData.get('order') as string;

  if (!question || !optionsJson) {
    throw new Error('Question and options are required');
  }

  const options = JSON.parse(optionsJson);

  const quizQuestion = await prisma.quizQuestion.create({
    data: {
      quizId,
      question,
      options,
      correctAnswer: parseInt(correctAnswer),
      explanation: explanation || null,
      order: order ? parseInt(order) : 0,
    },
  });

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/chapter/${quiz?.chapterId}`);
  return quizQuestion;
}

export async function deleteQuizQuestion(questionId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
    include: { quiz: true },
  });

  if (!question) {
    throw new Error('Question not found');
  }

  await prisma.quizQuestion.delete({
    where: { id: questionId },
  });

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/chapter/${question.quiz.chapterId}`);
}

// User enrollment action
export async function enrollInCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const enrollment = await prisma.courseEnrollment.create({
    data: {
      userId,
      courseId,
    },
  });

  revalidatePath('/courses');
  return enrollment;
}
