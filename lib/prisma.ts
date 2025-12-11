import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

// Main connection pool for general use
const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 30000, // 30 seconds to allow Neon to wake up
  idleTimeoutMillis: 60000, // Close idle connections after 60 seconds
  max: 10, // Maximum number of connections in the pool
});

// Separate pool for NextAuth
// Using a separate pool helps isolate auth queries from general queries
const authPool = new Pool({
  connectionString, // Using same DATABASE_URL
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 60000,
  max: 5, // Smaller pool for auth operations
});

const adapter = new PrismaPg(pool);
const authAdapter = new PrismaPg(authPool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAuth: PrismaClient | undefined;
};

// Main Prisma client with PrismaPg adapter for general use
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

// Separate Prisma client for NextAuth using dedicated connection pool
// Uses same database URL but isolated pool for better query management
export const prismaAuth =
  globalForPrisma.prismaAuth ??
  new PrismaClient({
    adapter: authAdapter,
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaAuth = prismaAuth;
}
