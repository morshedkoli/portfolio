import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio | Web Developer',
  description: 'A modern portfolio website showcasing web development skills with 3D animations and interactive elements.',
  keywords: 'web developer, portfolio, react, nextjs, 3d, animation, frontend, backend',
  authors: [{ name: 'Web Developer' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}