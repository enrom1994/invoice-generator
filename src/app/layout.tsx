import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SA Invoice Generator | Free Invoice Tool for South African Freelancers & Small Businesses',
  description:
    'Create professional invoices for free. Built for South African freelancers and small businesses with ZAR currency, optional 15% VAT, and PDF download. No signup required.',
  keywords: [
    'invoice generator',
    'South Africa',
    'ZAR',
    'freelancer invoice',
    'free invoice tool',
    'VAT invoice',
    'PDF invoice',
    'South African invoice',
  ],
  authors: [{ name: 'SA Invoice Generator' }],
  creator: 'SA Invoice Generator',
  openGraph: {
    title: 'SA Invoice Generator | Free Invoice Tool for South African Freelancers & Small Businesses',
    description:
      'Create professional invoices for free. Built for South African freelancers and small businesses with ZAR currency, optional 15% VAT, and PDF download.',
    type: 'website',
    locale: 'en_ZA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SA Invoice Generator',
    description: 'Free invoice generator for South African freelancers & small businesses',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
