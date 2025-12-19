import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Main Prisma client - using standard connection (adapter disabled due to WebSocket timeout issues)
// The Neon pooler works fine with standard PostgreSQL protocol
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
