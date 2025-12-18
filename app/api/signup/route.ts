import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signIn } from '@/lib/auth';
import { randomUUID } from 'crypto';
import { retryDatabaseOperation } from '@/lib/db-health';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists with retry logic
    const existingUser = await retryDatabaseOperation(
      async () => {
        return await prisma.user.findUnique({
          where: { email },
        });
      },
      3, // 3 retries
      1000 // 1 second initial delay
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with retry logic
    const user = await retryDatabaseOperation(
      async () => {
        return await prisma.user.create({
          data: {
            id: randomUUID(),
            email,
            password: hashedPassword,
            name: name || null,
          },
        });
      },
      3,
      1000
    );

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);

    // Check if it's a timeout error
    if (error instanceof Error) {
      if (
        error.message.includes('ETIMEDOUT') ||
        error.message.includes('timeout')
      ) {
        return NextResponse.json(
          {
            error:
              'Database connection timeout. The database may be starting up. Please try again in a moment.',
            details:
              'If this persists, the database service may be temporarily unavailable.',
          },
          { status: 503 }
        );
      }

      // Check if it's a connection error
      if (
        error.message.includes("Can't reach database") ||
        error.message.includes('P1001')
      ) {
        return NextResponse.json(
          {
            error: 'Unable to connect to database. Please try again later.',
            details:
              'The database service may be temporarily unavailable or starting up.',
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
