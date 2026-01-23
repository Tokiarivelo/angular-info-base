import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import ImpersonationBanner from '@/components/shared/ImpersonationBanner/ImpersonationBanner';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Angular Checklist App',
  description: 'Next.js checklist application with authentication',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isImpersonating = cookieStore.has('impersonate_userId');

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ImpersonationBanner isImpersonating={isImpersonating} />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
