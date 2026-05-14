import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ezra - AI Automation for Franchise Operations',
    template: '%s | Ezra',
  },
  description:
    'Enterprise AI automation platform for franchisors, franchisees, and multi-unit operators. Universal POS integration with Zenoti, Stripe, Toast, and more.',
  keywords: [
    'franchise automation',
    'POS integration',
    'AI analytics',
    'Zenoti',
    'Stripe',
    'franchise operations',
    'multi-unit',
    'sales intelligence',
  ],
  authors: [{ name: 'Ezra AI' }],
  creator: 'Ezra AI',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ezra.ai',
    siteName: 'Ezra',
    title: 'Ezra - AI Automation for Franchise Operations',
    description:
      'Enterprise AI automation platform for franchisors, franchisees, and multi-unit operators.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ezra - AI Automation for Franchise Operations',
    description:
      'Enterprise AI automation platform for franchisors, franchisees, and multi-unit operators.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
