import { PrismaClient } from '@prisma/client';
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
    },
  });

  console.log('Created user:', user.email);

  // Create a sample checklist
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
