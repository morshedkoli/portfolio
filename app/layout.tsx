import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata, Viewport } from 'next'
import ToasterProvider from '@/components/ToasterProvider'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Murshed Koli | Full Stack Web Developer & Portfolio',
    template: '%s | Murshed Koli',
  },
  description:
    'Professional portfolio of Murshed Koli — Full Stack Web Developer specializing in React, Next.js, TypeScript, and modern web technologies. Explore projects, skills, and experience.',
  keywords: [
    'Murshed Koli',
    'web developer',
    'full stack developer',
    'React developer',
    'Next.js developer',
    'TypeScript',
    'portfolio',
    'frontend developer',
    'backend developer',
    'JavaScript',
    'Node.js',
    'MongoDB',
  ],
  authors: [{ name: 'Murshed Koli', url: siteUrl }],
  creator: 'Murshed Koli',
  publisher: 'Murshed Koli',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Murshed Koli — Portfolio',
    title: 'Murshed Koli | Full Stack Web Developer',
    description:
      'Full Stack Web Developer specializing in React, Next.js, TypeScript, and modern web technologies. Explore my projects and get in touch.',
    images: [
      {
        url: '/image.png',
        width: 1200,
        height: 630,
        alt: 'Murshed Koli — Full Stack Web Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Murshed Koli | Full Stack Web Developer',
    description:
      'Full Stack Web Developer specializing in React, Next.js, TypeScript, and modern web technologies.',
    images: ['/image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  verification: {
    // Add your verification codes here if needed
    // google: 'your-google-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f23',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Murshed Koli',
    url: siteUrl,
    jobTitle: 'Full Stack Web Developer',
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'MongoDB', 'Web Development'],
    sameAs: [],
  }

  return (
    <html lang="en" className="theme-dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
