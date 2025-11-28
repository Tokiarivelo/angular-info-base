import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      role: UserRole.USER,
    },
  });

  console.log('Created user:', user.email);

  // Create an admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create a sample checklist (standalone, not part of any course)
  const checklist = await prisma.checklist.create({
    data: {
      title: 'Angular Fundamentals',
      description: 'Master the basics of Angular framework',
      ownerId: user.id,
      items: {
        create: [
          {
            title: 'Install Angular CLI',
            done: true,
            order: 0,
            notes: 'npm install -g @angular/cli',
          },
          {
            title: 'Learn about Components',
            done: false,
            order: 1,
            notes: 'Components are the building blocks',
          },
          {
            title: 'Understand Data Binding',
            done: false,
            order: 2,
          },
          {
            title: 'Master Dependency Injection',
            done: false,
            order: 3,
          },
        ],
      },
    },
  });

  console.log('Created checklist:', checklist.title);

  // Create a sample course
  const course = await prisma.course.create({
    data: {
      title: 'Full Stack Web Development',
      description: 'Learn to build modern web applications from scratch',
    },
  });

  console.log('Created course:', course.title);

  // Create chapters for the course
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'HTML & CSS Basics',
      description: 'Learn the foundations of web development',
      livePreviewUrl: 'https://codepen.io/pen', // Example live preview URL
      order: 0,
    },
  });

  const chapter2 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'JavaScript Fundamentals',
      description: 'Master JavaScript programming',
      livePreviewUrl: 'https://codesandbox.io/s/new', // Example live preview URL
      order: 1,
    },
  });

  console.log('Created chapters:', chapter1.title, chapter2.title);

  // Create checklists for chapters
  const chapterChecklist1 = await prisma.checklist.create({
    data: {
      title: 'HTML & CSS Tasks',
      description: 'Complete these tasks for HTML & CSS chapter',
      ownerId: adminUser.id,
      chapterId: chapter1.id,
      items: {
        create: [
          {
            title: 'Create a basic HTML page',
            order: 0,
            notes: 'Include DOCTYPE, html, head, and body tags',
          },
          {
            title: 'Style with CSS',
            order: 1,
            notes: 'Add colors, fonts, and layout',
          },
          {
            title: 'Make it responsive',
            order: 2,
            notes: 'Use media queries',
          },
        ],
      },
    },
  });

  const chapterChecklist2 = await prisma.checklist.create({
    data: {
      title: 'JavaScript Tasks',
      description: 'Complete these tasks for JavaScript chapter',
      ownerId: adminUser.id,
      chapterId: chapter2.id,
      items: {
        create: [
          {
            title: 'Learn variables and data types',
            order: 0,
          },
          {
            title: 'Understand functions',
            order: 1,
          },
          {
            title: 'Work with DOM manipulation',
            order: 2,
          },
        ],
      },
    },
  });

  console.log(
    'Created chapter checklists:',
    chapterChecklist1.title,
    chapterChecklist2.title
  );

  // Enroll user in course
  const enrollment = await prisma.courseEnrollment.create({
    data: {
      userId: user.id,
      courseId: course.id,
    },
  });

  console.log('Enrolled user in course');

  // Create user progress for chapter 1
  const progress = await prisma.userChapterProgress.create({
    data: {
      userId: user.id,
      chapterId: chapter1.id,
      repositoryUrl: 'https://github.com/user/html-css-project',
      websiteUrl: 'https://my-html-project.vercel.app',
      screenshotUrls: [
        // Screenshots can be stored in Cloudinary (free tier available)
        // Example: 'https://res.cloudinary.com/demo/image/upload/v1234567890/screenshot1.png'
      ],
      completed: false,
    },
  });

  console.log('Created user chapter progress');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
