'use client'

import { Suspense } from 'react'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'
import ParticleBackground from '@/components/ParticleBackground'
import Loading from '@/components/Loading'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Suspense fallback={<Loading />}>
        <ParticleBackground />
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </Suspense>
    </main>
  )
}