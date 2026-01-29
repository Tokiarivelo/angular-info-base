import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import ImpersonationBanner from '@/components/shared/ImpersonationBanner/ImpersonationBanner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
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

  // Get current locale and messages
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
