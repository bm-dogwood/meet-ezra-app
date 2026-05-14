// ===========================================
// EZRA PORTAL - Auth Layout
// ===========================================

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Ezra',
  description: 'Sign in to your Ezra portal',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
