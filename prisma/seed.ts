import { PrismaClient, UserRole } from '../prisma/generated';
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
      ChecklistItem: {
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
      ChecklistItem: {
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
      ChecklistItem: {
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
      completed: false,
    },
  });

  console.log('Created user chapter progress');

  // Create sample quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      chapterId: chapter1.id,
      title: 'HTML & CSS Basics Quiz',
      description: 'Test your knowledge of HTML and CSS fundamentals',
      passingScore: 70,
      QuizQuestion: {
        create: [
          {
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Markup Language',
            ],
            correctAnswer: 0,
            explanation:
              'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
            order: 0,
          },
          {
            question: 'Which CSS property is used to change the text color?',
            options: ['text-color', 'color', 'font-color', 'text-style'],
            correctAnswer: 1,
            explanation:
              'The "color" property is used to set the color of text in CSS.',
            order: 1,
          },
          {
            question:
              'What is the correct HTML element for the largest heading?',
            options: ['<heading>', '<h6>', '<h1>', '<head>'],
            correctAnswer: 2,
            explanation:
              '<h1> defines the most important heading, while <h6> defines the least important.',
            order: 2,
          },
        ],
      },
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      chapterId: chapter2.id,
      title: 'JavaScript Fundamentals Quiz',
      description: 'Evaluate your understanding of JavaScript basics',
      passingScore: 70,
      QuizQuestion: {
        create: [
          {
            question: 'Which of the following is a JavaScript data type?',
            options: ['String', 'Boolean', 'Number', 'All of the above'],
            correctAnswer: 3,
            explanation:
              'JavaScript has multiple primitive data types including String, Boolean, Number, and others.',
            order: 0,
          },
          {
            question: 'How do you declare a variable in JavaScript?',
            options: ['var x;', 'variable x;', 'v x;', 'x variable;'],
            correctAnswer: 0,
            explanation:
              'Variables in JavaScript can be declared using var, let, or const keywords.',
            order: 1,
          },
        ],
      },
    },
  });

  console.log('Created quizzes:', quiz1.title, quiz2.title);

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
