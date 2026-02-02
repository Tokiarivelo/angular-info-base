'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseFile } from '@/lib/fileParser';
import { randomUUID } from 'crypto';

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
      id: randomUUID(),
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
      id: randomUUID(),
      checklistId,
      title,
      notes: notes || null,
      order: itemCount,
      updatedAt: new Date(),
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
    include: { Checklist: true },
  });

  if (!item || item.Checklist.ownerId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.checklistItem.update({
    where: { id: itemId },
    data: { done },
  });

  revalidatePath(`/checklist/${item.checklistId}`);
}

export async function updateChecklistItem(itemId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const item = await prisma.checklistItem.findUnique({
    where: { id: itemId },
    include: { Checklist: true },
  });

  if (!item || item.Checklist.ownerId !== session.user.id) {
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
    include: { Checklist: true },
  });

  if (!item || item.Checklist.ownerId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.checklistItem.delete({
    where: { id: itemId },
  });

  revalidatePath(`/checklist/${item.Checklist.id}`);
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
  const checklist = await prisma.$transaction(async (tx: any) => {
    const newChecklist = await tx.checklist.create({
      data: {
        id: randomUUID(),
        title: parsedChecklist.title,
        description: parsedChecklist.description,
        ownerId: userId,
      },
    });

    // Create all items
    if (parsedChecklist.items.length > 0) {
      await tx.checklistItem.createMany({
        data: parsedChecklist.items.map((item: any, index: number) => ({
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
      id: randomUUID(),
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
      // Import cloudinary to delete directly
      const { v2: cloudinary } = await import('cloudinary');
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      await cloudinary.uploader.destroy(screenshot.publicId);
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
export async function submitQuiz(quizId: string, answers: number[]) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Get quiz with questions
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { QuizQuestion: { orderBy: { order: 'asc' } } },
  });

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // Calculate score
  let correctCount = 0;
  quiz.QuizQuestion.forEach((question: any, index: number) => {
    if (answers[index] === question.correctAnswer) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / quiz.QuizQuestion.length) * 100);
  const passed = score >= quiz.passingScore;

  // Save submission
  const submission = await prisma.quizSubmission.create({
    data: {
      id: randomUUID(),
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
      id: randomUUID(),
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
  const imageUrl = formData.get('imageUrl') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      title,
      description: description || null,
      imageUrl: imageUrl || null,
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

  let contentJson = null;
  if (content) {
    try {
      contentJson = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse content JSON', e);
    }
  }

  const chapter = await prisma.chapter.create({
    data: {
      id: randomUUID(),
      courseId,
      title,
      description: description || null,
      content: contentJson,
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

  let contentJson = undefined;
  if (content) {
    try {
      contentJson = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse content JSON', e);
    }
  } else if (content === '') {
    contentJson = null;
  }

  const chapter = await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      title,
      description: description || null,
      content: contentJson,
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
      id: randomUUID(),
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
      id: randomUUID(),
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
    include: { Quiz: true },
  });

  if (!question) {
    throw new Error('Question not found');
  }

  await prisma.quizQuestion.delete({
    where: { id: questionId },
  });

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/chapter/${question.Quiz.chapterId}`);
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
      id: randomUUID(),
      userId,
      courseId,
    },
  });

  revalidatePath('/courses');
  return enrollment;
}

// Enrollment Request Actions
export async function requestCourseEnrollment(
  courseId: string,
  message?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Check if already enrolled
  const existingEnrollment = await prisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingEnrollment) {
    throw new Error('Already enrolled in this course');
  }

  // Check if request already exists
  const existingRequest = await prisma.enrollmentRequest.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingRequest) {
    if (existingRequest.status === 'PENDING') {
      throw new Error('Request already pending');
    }
    // Update existing rejected request to pending
    const request = await prisma.enrollmentRequest.update({
      where: { id: existingRequest.id },
      data: {
        status: 'PENDING',
        message: message || null,
        reviewedBy: null,
        reviewedAt: null,
      },
    });
    revalidatePath('/courses');
    return request;
  }

  const request = await prisma.enrollmentRequest.create({
    data: {
      id: randomUUID(),
      userId,
      courseId,
      message: message || null,
      status: 'PENDING',
    },
  });

  revalidatePath('/courses');
  revalidatePath('/admin/enrollment-requests');
  return request;
}

export async function cancelEnrollmentRequest(requestId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const request = await prisma.enrollmentRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.userId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.enrollmentRequest.delete({
    where: { id: requestId },
  });

  revalidatePath('/courses');
  return request;
}

// Admin: Review enrollment requests
export async function reviewEnrollmentRequest(
  requestId: string,
  approved: boolean
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const request = await prisma.enrollmentRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error('Request not found');
  }

  if (approved) {
    // Create enrollment
    await prisma.courseEnrollment.create({
      data: {
        id: randomUUID(),
        userId: request.userId,
        courseId: request.courseId,
        assignedBy: session.user.id,
      },
    });

    // Update request status
    await prisma.enrollmentRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });
  } else {
    await prisma.enrollmentRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });
  }

  revalidatePath('/admin/enrollment-requests');
  revalidatePath('/courses');
  return request;
}

// Admin: Assign course to user
export async function assignCourseToUser(userId: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingEnrollment) {
    throw new Error('User already enrolled');
  }

  const enrollment = await prisma.courseEnrollment.create({
    data: {
      id: randomUUID(),
      userId,
      courseId,
      assignedBy: session.user.id,
    },
  });

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${courseId}`);
  return enrollment;
}

// Course Request Actions
export async function requestNewCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const reason = formData.get('reason') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  const courseRequest = await prisma.courseRequest.create({
    data: {
      id: randomUUID(),
      userId: session.user.id,
      title,
      description: description || null,
      reason: reason || null,
      status: 'PENDING',
    },
  });

  revalidatePath('/courses');
  revalidatePath('/admin/course-requests');
  return courseRequest;
}

export async function cancelCourseRequest(requestId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const request = await prisma.courseRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.userId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.courseRequest.delete({
    where: { id: requestId },
  });

  revalidatePath('/courses');
  return request;
}

// Admin: Review course requests
export async function reviewCourseRequest(
  requestId: string,
  status: 'APPROVED' | 'REJECTED' | 'IN_PROGRESS'
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const request = await prisma.courseRequest.update({
    where: { id: requestId },
    data: {
      status,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  });

  revalidatePath('/admin/course-requests');
  return request;
}
