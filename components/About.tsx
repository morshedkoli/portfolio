'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Code, Palette, Zap } from 'lucide-react'

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
      icon: <Code className="w-8 h-8" />,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code following best practices.'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Modern Design',
      description: 'Creating beautiful, responsive interfaces with attention to user experience.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Performance',
      description: 'Optimizing applications for speed, accessibility, and search engines.'
    }
  ]

  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 glow-text">
            About Me
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                profile?.description || 'I\'m a passionate web developer with expertise in modern technologies. I love creating digital experiences that combine functionality with beautiful design, always staying up-to-date with the latest trends and best practices in web development.'
              )}
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  profile?.name ? `Meet ${profile.name}` : 'My Journey'
                )}
              </h3>
              
              {!loading && profile && (
                <div className="grid gap-6">
                  <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                    <h4 className="text-xl font-semibold text-blue-400 mb-3">Professional Title</h4>
                    <p className="text-gray-200 text-lg">{profile.title}</p>
                  </div>
                  
                  {profile.location && (
                    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                      <h4 className="text-xl font-semibold text-purple-400 mb-3">Location</h4>
                      <p className="text-gray-200 text-lg">{profile.location}</p>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300">
                    <h4 className="text-xl font-semibold text-green-400 mb-3">Contact</h4>
                    <div className="space-y-2">
                      <p className="text-gray-200 text-lg">{profile.email}</p>
                      {profile.phone && <p className="text-gray-200 text-lg">{profile.phone}</p>}
                    </div>
                  </div>
                </div>
              )}
              
              {(loading || !profile) && (
                <div className="space-y-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    With several years of experience in web development, I've worked on various projects 
                    ranging from simple websites to complex web applications. My passion lies in creating 
                    seamless user experiences and solving complex problems through code.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    I specialize in React, Next.js, TypeScript, and modern CSS frameworks. 
                    I'm always eager to learn new technologies and improve my skills to deliver 
                    the best possible solutions.
                  </p>
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20"
              onClick={() => {
                const projectsSection = document.querySelector('#projects')
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              View My Projects
            </motion.button>
          </motion.div>

          {/* Right Content - Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What I Bring
              </h3>
              <p className="text-gray-300 text-lg">
                Core values that drive my development approach
              </p>
            </div>
            
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="group bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-gray-300 text-lg leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About