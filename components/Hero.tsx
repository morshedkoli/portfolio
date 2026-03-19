'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { ChevronDown, Github, Linkedin, Twitter, ExternalLink, Facebook, Youtube, Download, MessageCircle } from 'lucide-react'

interface Profile {
  name: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
    facebook?: string
    youtube?: string
  }
  heroImage?: string
  resume?: string
}

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTyping, setStartTyping] = useState(false)

  useEffect(() => {
    const delayTimer = setTimeout(() => setStartTyping(true), delay)
    return () => clearTimeout(delayTimer)
  }, [delay])

  useEffect(() => {
    if (!startTyping) return
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, startTyping])

  return (
    <span>
      {displayedText}
      <span className="inline-block w-0.5 h-8 md:h-10 bg-blue-400 ml-1 animate-pulse" />
    </span>
  )
}

const Hero = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return <Github size={20} />
      case 'linkedin': return <Linkedin size={20} />
      case 'twitter': return <Twitter size={20} />
      case 'facebook': return <Facebook size={20} />
      case 'youtube': return <Youtube size={20} />
      default: return <ExternalLink size={20} />
    }
  }

  const getSocialColor = (platform: string) => {
    switch (platform) {
      case 'github': return 'hover:bg-gray-700 hover:border-gray-500'
      case 'linkedin': return 'hover:bg-blue-600/20 hover:border-blue-500'
      case 'twitter': return 'hover:bg-sky-500/20 hover:border-sky-400'
      case 'facebook': return 'hover:bg-blue-600/20 hover:border-blue-600'
      case 'youtube': return 'hover:bg-red-600/20 hover:border-red-500'
      default: return 'hover:bg-purple-600/20 hover:border-purple-500'
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-0">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/30" />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-500/20 blur-[100px]"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 2,
            y: -mousePosition.y * 2,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-600/30 to-pink-500/20 blur-[100px]"
        />

        {/* Rotating rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[600px] h-[600px] lg:w-[800px] lg:h-[800px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-blue-500/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-8 rounded-full border border-purple-500/15"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-16 rounded-full border border-cyan-500/10"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl animate-pulse-slow" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen py-20">
          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-6"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-sm font-medium">Available for work</span>
            </motion.div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-16 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl animate-pulse"></div>
                <div className="h-8 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg animate-pulse w-3/4"></div>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                      {profile?.name || 'Web Developer'}
                    </span>
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mb-6"
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-medium">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {profile?.title || 'Full Stack Developer'}
                    </span>
                  </h2>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl lg:mx-0 mx-auto leading-relaxed"
                >
                  {profile?.description || 'Creating immersive digital experiences with modern technologies'}
                </motion.p>
              </>
            )}

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300"
                onClick={() => {
                  if (profile?.resume) {
                    window.open(profile.resume, '_blank');
                  } else {
                    scrollToAbout();
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 transition-all duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {profile?.resume ? (
                    <>
                      <Download size={18} />
                      Download CV
                    </>
                  ) : (
                    'Explore My Work'
                  )}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 rounded-xl font-semibold transition-all duration-300 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm flex items-center gap-2"
                onClick={() => {
                  const contactSection = document.querySelector('#contact')
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
                Get In Touch
              </motion.button>
            </motion.div>

            {/* Social Links */}
            {!loading && profile?.socialLinks && (
              <motion.div
                className="flex justify-center lg:justify-start gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                {Object.entries(profile.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 ${getSocialColor(platform)}`}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-gray-400 group-hover:text-white transition-colors">
                        {getSocialIcon(platform)}
                      </div>
                    </motion.a>
                  )
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Developer Image */}
          <motion.div
            className="flex justify-center lg:justify-end order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="relative"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Decorative rings */}
              <div className="absolute -inset-4 md:-inset-8 rounded-full border border-blue-500/20 animate-pulse" />
              <div className="absolute -inset-8 md:-inset-16 rounded-full border border-purple-500/10" />
              
              {/* Glowing backdrop */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl scale-110" />
              
              {/* Main image container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden">
                {/* Gradient border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-500 p-1">
                  <div className="w-full h-full rounded-full bg-slate-950 p-1 overflow-hidden">
                    {profile?.heroImage ? (
                      <motion.img
                        src={profile.heroImage}
                        alt="Developer"
                        className="w-full h-full object-cover rounded-full"
                        initial={{ scale: 1.1, filter: 'blur(10px)' }}
                        animate={{ scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      />
                    ) : (
                      <motion.div
                        className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        {/* Placeholder Avatar */}
                        <div className="relative">
                          <svg 
                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 text-slate-700" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          {/* Subtle animated glow */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 rounded-full animate-pulse" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Animated overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 animate-pulse-slow" />
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
                className="absolute -right-2 top-1/4 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white text-xs font-medium shadow-lg shadow-blue-500/25"
              >
                💻 Developer
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: 'spring' }}
                className="absolute -left-2 bottom-1/4 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white text-xs font-medium shadow-lg shadow-purple-500/25"
              >
                🎨 Designer
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={scrollToAbout}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-blue-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
