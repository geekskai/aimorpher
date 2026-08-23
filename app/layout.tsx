import type React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';

export const metadata: Metadata = {
  metadataBase: new URL('https://aimorpher.com'),
  title: {
    default: 'Resume Website Builder for Developers | Aimorpher',
    template: '%s | Aimorpher',
  },
  description:
    'Turn a PDF resume into an editable professional website for technical hiring. Review every detail, publish free, and share one polished link.',
  openGraph: {
    type: 'website',
    siteName: 'Aimorpher',
    title: 'Resume Website Builder for Developers | Aimorpher',
    description:
      'Turn a PDF resume into an editable professional website for technical hiring.',
    images: '/opengraph-image',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Website Builder for Developers | Aimorpher',
    description:
      'Turn a PDF resume into an editable professional website for technical hiring.',
    images: '/opengraph-image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <PlausibleProvider domain="aimorpher.com">
        <ReactQueryClientProvider>
          <html lang="en">
            <head>
              {/* {process.env.NODE_ENV === "development" && (
              <script
                crossOrigin="anonymous"
                src="//unpkg.com/react-scan/dist/auto.global.js"
              />
            )} */}
              {/* rest of your scripts go under */}
            </head>
            <body className="min-h-screen flex flex-col font-mono">
              <main className="flex-1 flex flex-col">{children}</main>
              <Toaster richColors position="bottom-center" />
            </body>
          </html>
        </ReactQueryClientProvider>
      </PlausibleProvider>
    </ClerkProvider>
  );
}
