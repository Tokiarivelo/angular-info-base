const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  console.log('Testing DB connection...');
  const start = Date.now();
  try {
    await prisma.user.findFirst();
    const duration = Date.now() - start;
    console.log(`✅ DB Query took ${duration}ms`);
  } catch (error) {
    console.error('❌ DB Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
