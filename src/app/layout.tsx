import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  metadataBase: new URL('https://zenvoice.netlify.app'),
  title: 'Zenvoice — Free Invoice Generator | No Signup, No Watermark',
  description:
    'Create professional invoices and quotations instantly in your browser. 100% free, private, and offline. No watermarks, no login required. Download PDF or share via WhatsApp.',
  keywords: [
    'free invoice generator',
    'no watermark invoice',
    'invoice generator no signup',
    'offline invoice maker',
    'private invoice generator',
    'PDF invoice creator',
    'WhatsApp invoice',
    'quotation maker',
    'freelance invoice',
    'Zenvoice',
  ],
  authors: [{ name: 'Zenvoice' }],
  creator: 'Zenvoice',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Zenvoice — Free Invoice Generator | No Signup, No Watermark',
    description:
      'Create clean PDF invoices instantly. No signup. No hidden fees. Works offline. Share via WhatsApp.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Zenvoice',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zenvoice — Simple invoices. No signup. No subscriptions.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenvoice — Free Invoice Generator',
    description: 'Simple invoices. No signup. No subscriptions. No ads.',
    images: ['/og-image.png'],
  },
  robots: 'index, follow',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Zenvoice',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free version includes 3 templates, PDF export, and WhatsApp sharing.',
  },
  featureList: [
    'No Watermark',
    'No Signup Required',
    'Offline Mode',
    'WhatsApp Sharing',
    'Multi-currency Support',
    'PDF Export',
    'Privacy-First (100% Client-Side)',
  ],
  author: {
    '@type': 'Organization',
    name: 'Zenvoice',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
