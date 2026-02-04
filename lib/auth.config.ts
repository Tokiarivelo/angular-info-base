import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // For OAuth users, role might not be set in the user object
        // Fall back to USER role if not present
        token.role = (user as any).role ?? 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        (session.user as any).role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const staticProtect =
        nextUrl.pathname.startsWith('/checklist') ||
        nextUrl.pathname.startsWith('/profile');

      const adminProtect = nextUrl.pathname.startsWith('/admin');

      if (staticProtect && !isLoggedIn) {
        return false;
      }

      if (adminProtect) {
        if (!isLoggedIn) return false;
        if ((auth?.user as any)?.role !== 'ADMIN') {
          // Redirect non-admin users to home or error page
          return Response.redirect(new URL('/', nextUrl));
        }
      }

      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
