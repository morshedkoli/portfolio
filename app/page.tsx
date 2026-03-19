'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'
import Loading from '@/components/Loading'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import Footer from '@/components/Footer'

const Hero = dynamic(() => import('@/components/Hero'), { ssr: false })
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Suspense fallback={<Loading />}>
        <ParticleBackground />
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <Contact />
        <Footer />
      </Suspense>
    </main>
  )
}
