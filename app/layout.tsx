import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Angular Checklist App',
  description: 'Next.js checklist application with authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
