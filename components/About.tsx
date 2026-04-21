'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Code, Palette, Zap, ArrowRight, MapPin, Mail, Phone, Briefcase } from 'lucide-react'

interface ProfileData {
  name: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  avatar?: string
  resume?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

// 3D Tilt card component
const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateZ(10px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

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

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code following best practices.',
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'group-hover:shadow-blue-500/20'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Modern Design',
      description: 'Creating beautiful, responsive interfaces with attention to user experience.',
      gradient: 'from-purple-500 to-pink-500',
      glow: 'group-hover:shadow-purple-500/20'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Performance',
      description: 'Optimizing applications for speed, accessibility, and search engines.',
      gradient: 'from-amber-500 to-orange-500',
      glow: 'group-hover:shadow-amber-500/20'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7 } }
  }

  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
          >
            <Briefcase size={14} className="text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Who I Am</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-400/90 leading-relaxed">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                profile?.description || 'I\'m a passionate web developer with expertise in modern technologies.'
              )}
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content — Profile Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  profile?.name ? `Meet ${profile.name}` : 'My Journey'
                )}
              </h3>
            </motion.div>
            
            {!loading && profile && (
              <div className="grid gap-4">
                <motion.div variants={itemVariants}>
                  <TiltCard>
                    <div className="glass-card rounded-2xl p-6 group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/10">
                          <Briefcase size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-0.5">Professional Title</p>
                          <p className="text-white font-semibold text-lg">{profile.title}</p>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
                
                {profile.location && (
                  <motion.div variants={itemVariants}>
                    <TiltCard>
                      <div className="glass-card rounded-2xl p-6 group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/10">
                            <MapPin size={20} className="text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-0.5">Location</p>
                            <p className="text-white font-semibold text-lg">{profile.location}</p>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants}>
                  <TiltCard>
                    <div className="glass-card rounded-2xl p-6 group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/10 border border-emerald-500/10">
                          <Mail size={20} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-0.5">Contact</p>
                          <p className="text-white font-semibold">{profile.email}</p>
                          {profile.phone && <p className="text-gray-400 text-sm mt-0.5">{profile.phone}</p>}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </div>
            )}
            
            {(loading || !profile) && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[88px] bg-white/[0.03] rounded-2xl animate-pulse border border-white/[0.04]" />
                ))}
              </div>
            )}
            
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(59, 130, 246, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                className="group mt-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center gap-2"
                onClick={() => {
                  const projectsSection = document.querySelector('#projects')
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                View My Projects
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content — Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                What I Bring
              </h3>
              <p className="text-gray-400 text-base mb-8">
                Core values that drive my development approach
              </p>
            </motion.div>
            
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <TiltCard>
                  <div className={`group glass-card rounded-2xl p-7 ${feature.glow} hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex items-start gap-5">
                      <div className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                          {feature.title}
                        </h4>
                        <p className="text-gray-400/90 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
