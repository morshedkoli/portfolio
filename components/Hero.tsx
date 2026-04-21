'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useEffect, useState, useCallback, useRef } from 'react'
import { ChevronDown, Github, Linkedin, Twitter, ExternalLink, Facebook, Youtube, Download, MessageCircle, ArrowDown, Sparkles } from 'lucide-react'
import type { PublicProfile } from '@/lib/site-data'

interface HeroProps {
  profile: PublicProfile
  projectCount?: number
  skillCount?: number
}

// Animated counter component
const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const duration = 2000
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    const timer = setTimeout(() => requestAnimationFrame(step), 1500)
    return () => clearTimeout(timer)
  }, [value])

  return <span>{count}{suffix}</span>
}

// Magnetic button component  
const MagneticButton = ({ children, className, onClick, ...props }: any) => {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

const Hero = ({ profile, projectCount = 0, skillCount = 0 }: HeroProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 30,
      y: (e.clientY / window.innerHeight - 0.5) * 30,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return <Github size={18} />
      case 'linkedin': return <Linkedin size={18} />
      case 'twitter': return <Twitter size={18} />
      case 'facebook': return <Facebook size={18} />
      case 'youtube': return <Youtube size={18} />
      default: return <ExternalLink size={18} />
    }
  }

  const getSocialColor = (platform: string) => {
    switch (platform) {
      case 'github': return 'hover:bg-white/10 hover:border-gray-400/50 hover:shadow-gray-500/20'
      case 'linkedin': return 'hover:bg-blue-500/10 hover:border-blue-400/50 hover:shadow-blue-500/20'
      case 'twitter': return 'hover:bg-sky-500/10 hover:border-sky-400/50 hover:shadow-sky-500/20'
      case 'facebook': return 'hover:bg-blue-600/10 hover:border-blue-500/50 hover:shadow-blue-600/20'
      case 'youtube': return 'hover:bg-red-500/10 hover:border-red-400/50 hover:shadow-red-500/20'
      default: return 'hover:bg-purple-500/10 hover:border-purple-400/50 hover:shadow-purple-500/20'
    }
  }

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-0">
      {/* Animated grid pattern */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Content */}
      <div className="relative z-10 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen py-20">
          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status badge */}
            <motion.div variants={childVariants} className="mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-300/90 text-sm font-medium tracking-wide">Available for work</span>
              </div>
            </motion.div>

            <motion.div variants={childVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 tracking-tight">
                <motion.span
                  className="inline-block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                  style={{
                    transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px, 0)`,
                  }}
                >
                  {profile?.name || 'Web Developer'}
                </motion.span>
              </h1>
            </motion.div>

            <motion.div variants={childVariants} className="mb-6">
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                    {profile?.title || 'Full Stack Developer'}
                  </span>
                </span>
              </p>
            </motion.div>

            <motion.p
              variants={childVariants}
              className="text-base md:text-lg text-gray-400/90 mb-10 max-w-xl lg:mx-0 mx-auto leading-relaxed"
            >
              {profile?.description || 'Creating immersive digital experiences with modern technologies'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={childVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <MagneticButton
                className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-500"
                onClick={() => {
                  if (profile?.resume) {
                    window.open(profile.resume, '_blank')
                  } else {
                    scrollToAbout()
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 transition-all duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <span className="relative flex items-center gap-2.5">
                  {profile?.resume ? (
                    <>
                      <Download size={18} className="group-hover:animate-bounce" />
                      Download CV
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Explore My Work
                    </>
                  )}
                </span>
              </MagneticButton>

              <MagneticButton
                className="group px-8 py-4 rounded-2xl font-semibold transition-all duration-500 border border-white/10 text-white hover:bg-white/5 hover:border-white/25 backdrop-blur-sm flex items-center gap-2.5"
                onClick={() => {
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <MessageCircle size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                Get In Touch
              </MagneticButton>
            </motion.div>

            {/* Social Links */}
            {profile?.socialLinks && (
              <motion.div
                variants={childVariants}
                className="flex justify-center lg:justify-start gap-3 mt-10"
              >
                {Object.entries(profile.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${profile.name} on ${platform}`}
                      className={`p-3 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${getSocialColor(platform)}`}
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-gray-400 hover:text-white transition-colors">
                        {getSocialIcon(platform)}
                      </div>
                    </motion.a>
                  )
                })}
              </motion.div>
            )}

            {/* Stats row */}
            <motion.div
              variants={childVariants}
              className="flex justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-white/[0.06]"
            >
              {[
                { value: projectCount || 0, suffix: '+', label: 'Projects' },
                { value: skillCount || 0, suffix: '+', label: 'Skills' },
                { value: 3, suffix: '+', label: 'Years Exp' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Developer Image */}
          <motion.div
            className="flex justify-center lg:justify-end order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Outer glow rings with 3D perspective */}
              <motion.div
                className="absolute -inset-6 md:-inset-10 rounded-full border border-blue-500/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-10 md:-inset-16 rounded-full border border-purple-500/[0.06]"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />

              {/* Glowing backdrop */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 via-purple-500/15 to-cyan-500/20 blur-3xl scale-125" />

              {/* Main image container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[360px] md:h-[360px] rounded-full overflow-hidden">
                {/* Gradient border */}
                <div className="absolute inset-0 rounded-full p-[3px]" style={{
                  background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
                }}>
                  <div className="w-full h-full rounded-full bg-[#030014] p-1 overflow-hidden">
                    {profile?.heroImage ? (
                      <motion.img
                        src={profile.heroImage}
                        alt={`${profile.name} portrait`}
                        className="w-full h-full object-cover rounded-full"
                        initial={{ scale: 1.2, filter: 'blur(10px)' }}
                        animate={{ scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    ) : (
                      <motion.div
                        className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <svg className="w-32 h-32 sm:w-40 sm:h-40 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating badges with spring physics */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute -right-3 top-1/4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white text-xs font-semibold shadow-xl shadow-blue-500/30 backdrop-blur-sm border border-white/10"
              >
                💻 Full Stack
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.8, type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute -left-3 bottom-1/4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white text-xs font-semibold shadow-xl shadow-purple-500/30 backdrop-blur-sm border border-white/10"
              >
                🎨 UI/UX
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 2.1, type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white text-xs font-semibold shadow-xl shadow-emerald-500/30 backdrop-blur-sm border border-white/10"
              >
                🤖 AI Engineer
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        onClick={scrollToAbout}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] text-gray-500/60 uppercase tracking-[0.3em] font-medium">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1 rounded-full bg-blue-400/80"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
