import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata, Viewport } from 'next'
import ToasterProvider from '@/components/ToasterProvider'
import { prisma } from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

// Fetch settings from database
async function getSettings() {
  try {
    const settings = await prisma.settings.findMany()
    const settingsMap: Record<string, any> = {}
    settings.forEach((s) => {
      settingsMap[s.key] = s.value
    })
    return settingsMap
  } catch (error) {
    console.error('Error fetching settings for metadata:', error)
    return {}
  }
}

// Fetch profile from database
async function getProfile() {
  try {
    const profile = await prisma.profile.findFirst()
    return profile
  } catch (error) {
    console.error('Error fetching profile for metadata:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [settings, profile] = await Promise.all([getSettings(), getProfile()])
  
  const siteName = settings.siteName || profile?.name || 'Portfolio'
  const siteDescription = settings.siteDescription || profile?.description || 'Professional portfolio showcasing projects, skills, and experience.'
  const siteTitle = settings.siteTitle || `${siteName} | ${siteDescription}`
  const siteKeywords = settings.siteKeywords || [
    siteName,
    'web developer',
    'full stack developer',
    'React developer',
    'Next.js developer',
    'TypeScript',
    'portfolio',
  ]

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: Array.isArray(siteKeywords) ? siteKeywords : [siteKeywords],
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
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
      siteName: `${siteName} — Portfolio`,
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: profile?.heroImage || '/image.png',
          width: 1200,
          height: 630,
          alt: `${siteName} — Full Stack Web Developer`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [profile?.heroImage || '/image.png'],
    },
    alternates: {
      canonical: siteUrl,
    },
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f23',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, profile] = await Promise.all([getSettings(), getProfile()])
  
  const siteName = settings.siteName || profile?.name || 'Portfolio'

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteName,
    url: siteUrl,
    jobTitle: profile?.title || 'Full Stack Web Developer',
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'MongoDB', 'Web Development'],
    sameAs: profile?.socialLinks ? Object.values(profile.socialLinks as Record<string, string>).filter(Boolean) : [],
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
      <body className={`${inter.className} overflow-x-hidden`} suppressHydrationWarning>
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
