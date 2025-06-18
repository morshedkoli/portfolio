'use client'

import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { ChevronDown, Github, Linkedin, Twitter, ExternalLink, Facebook, Youtube } from 'lucide-react'

const AnimatedSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.rotation.y += 0.01
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1)
    }
  })

  return (
    <mesh ref={meshRef} scale={2}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#3b82f6"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

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
}

const Hero = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
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

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return <Github size={20} />
      case 'linkedin':
        return <Linkedin size={20} />
      case 'twitter':
        return <Twitter size={20} />
      case 'facebook':
        return <Facebook size={20} />
      case 'youtube':
        return <Youtube size={20} />
      default:
        return <ExternalLink size={20} />
    }
  }

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="h-16 bg-gray-700 rounded mb-6"></div>
                <div className="h-8 bg-gray-700 rounded mb-8"></div>
              </div>
            ) : (
              <>
                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-white mb-6 glow-text"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {profile?.name || 'Web Developer'}
                </motion.h1>
                
                <motion.h2
                  className="text-2xl md:text-3xl text-blue-400 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  {profile?.title || 'Full Stack Developer'}
                </motion.h2>
                
                <motion.p
                  className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl lg:mx-0 mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  {profile?.description || 'Creating immersive digital experiences with modern technologies'}
                </motion.p>
              </>
            )}

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px #3b82f6' }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 animate-glow"
              onClick={scrollToAbout}
            >
              Explore My Work
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold transition-all duration-300"
              onClick={() => {
                const contactSection = document.querySelector('#contact')
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              Get In Touch
            </motion.button>
            </motion.div>

            {/* Social Links */}
            {!loading && profile?.socialLinks && (
              <motion.div
                className="flex justify-center lg:justify-start gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                {Object.entries(profile.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full border border-gray-600 hover:border-blue-500 transition-all duration-300 group"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-gray-400 group-hover:text-blue-400 transition-colors">
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
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              
              <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl">
                <motion.img
                   src="/image.png"
                   alt="Developer"
                   className="w-full h-full object-cover"
                   initial={{ scale: 1.1 }}
                   animate={{ scale: 1 }}
                   transition={{ duration: 1, delay: 0.6 }}
                 />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 animate-pulse"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToAbout}
      >
        <ChevronDown className="text-white w-8 h-8" />
      </motion.div>
    </section>
  )
}

export default Hero