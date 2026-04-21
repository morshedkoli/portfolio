'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Menu, X, Sparkles, Download, ArrowUpRight } from 'lucide-react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [siteName, setSiteName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const settings = await res.json()
          setSiteName(settings.siteName || '')
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const downloadResume = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/resume')
      if (!response.ok) throw new Error('Failed to generate resume')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Morshed_al_main_resume.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download resume:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = ['home', 'about', 'skills', 'experience', 'education', 'certifications', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Education', href: '#education', id: 'education' },
    { name: 'Certifications', href: '#certifications', id: 'certifications' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ]

  const scrollToSection = (href: string) => {
    if (isOpen) {
      setIsOpen(false)
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 350)
    } else {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Magnetic nav item
  const NavItem = ({ item, index }: { item: typeof navItems[0]; index: number }) => {
    const ref = useRef<HTMLButtonElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 400, damping: 25 })
    const springY = useSpring(y, { stiffness: 400, damping: 25 })

    return (
      <motion.button
        ref={ref}
        style={{ x: springX, y: springY }}
        onMouseMove={(e) => {
          if (!ref.current) return
          const rect = ref.current.getBoundingClientRect()
          x.set((e.clientX - rect.left - rect.width / 2) * 0.08)
          y.set((e.clientY - rect.top - rect.height / 2) * 0.08)
        }}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        onClick={() => scrollToSection(item.href)}
        className={`relative px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 ${
          activeSection === item.id 
            ? 'text-white' 
            : 'text-gray-400/80 hover:text-white/90'
        }`}
      >
        {activeSection === item.id && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)',
              border: '1px solid rgba(59,130,246,0.2)',
              boxShadow: '0 0 20px rgba(59,130,246,0.1), inset 0 0 20px rgba(59,130,246,0.05)',
            }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
          />
        )}
        <span className="relative z-10">{item.name}</span>
      </motion.button>
    )
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled 
          ? 'py-2' 
          : 'py-3'
      }`}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 transition-all duration-700 ${
        scrolled
          ? 'bg-[#030014]/70 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => scrollToSection('#home')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-blue-100 to-white/80 bg-clip-text text-transparent tracking-tight">
              {siteName ? `@${siteName.toLowerCase().replace(/\s+/g, '')}` : ''}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-white/[0.03] backdrop-blur-xl rounded-2xl p-1.5 border border-white/[0.06]">
              {navItems.map((item, index) => (
                <NavItem key={item.name} item={item} index={index} />
              ))}
            </div>
            
            {/* Resume button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadResume}
              disabled={isGenerating}
              className="ml-3 group relative p-2.5 rounded-xl overflow-hidden disabled:opacity-50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
              <Download size={16} className={`relative text-white ${isGenerating ? 'animate-pulse' : ''}`} />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white hover:bg-white/[0.08] transition-all duration-300"
              whileTap={{ scale: 0.92 }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="bg-[#0a0a2e]/95 backdrop-blur-2xl rounded-2xl mt-3 p-2 border border-white/[0.06] shadow-2xl shadow-black/40 max-h-[calc(100vh-80px)] overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center justify-between w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      activeSection === item.id 
                        ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white border border-blue-500/15' 
                        : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span className="font-medium text-sm">{item.name}</span>
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeMobileDot"
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
                      />
                    )}
                  </motion.button>
                ))}
                
                <div className="h-px w-full bg-white/[0.06] my-2" />
                
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    downloadResume()
                    setIsOpen(false)
                  }}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  <Download size={16} className={isGenerating ? 'animate-pulse' : ''} />
                  {isGenerating ? 'Generating...' : 'Download Resume'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navigation
