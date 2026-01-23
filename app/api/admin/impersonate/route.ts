import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userId } = body;

    const cookieStore = await cookies();

    if (userId) {
      // Start impersonating
      cookieStore.set('impersonate_userId', userId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return NextResponse.json({ message: `Impersonating user ${userId}` });
    } else {
      // Stop impersonating
      cookieStore.delete('impersonate_userId');
      return NextResponse.json({ message: 'Stopped impersonation' });
    }
  } catch (error) {
    console.error('Error in impersonation route:', error);
    return NextResponse.json(
      { error: 'Failed to process impersonation request' },
      { status: 500 }
    );
  }
}
