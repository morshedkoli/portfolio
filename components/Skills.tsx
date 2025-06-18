'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon?: string
  order: number
}

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true)
        // Add a small delay to ensure API is ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const response = await fetch('/api/skills', {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Fetched skills:', data) // Debug log
        setSkills(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills')
        console.error('Error fetching skills:', err)
      } finally {
        setLoading(false)
      }
    }

    // Use setTimeout to ensure component is mounted
    const timer = setTimeout(fetchSkills, 50)
    return () => clearTimeout(timer)
  }, [])

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  // Get color based on proficiency level
  const getSkillColor = (proficiency: number) => {
    if (proficiency >= 90) return '#10B981' // Green
    if (proficiency >= 75) return '#3B82F6' // Blue
    if (proficiency >= 60) return '#F59E0B' // Yellow
    return '#EF4444' // Red
  }

  // Always render the section, show loading/error states within
  console.log('Skills component render:', { loading, error, skillsCount: skills.length })

  return (
    <section id="skills" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
            Skills & Technologies
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {/* Skills Progress Bars by Category */}
        {!loading && !error && Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 + categoryIndex * 0.1 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6 capitalize flex items-center gap-2">
              <span className="text-blue-400">#</span>
              {category}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categorySkills
                .sort((a, b) => a.order - b.order)
                .map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 + index * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      {skill.icon && (
                        <span className="text-xl group-hover:animate-bounce">{skill.icon}</span>
                      )}
                      <h4 className="text-white font-semibold text-lg">{skill.name}</h4>
                    </div>
                    <span className="text-blue-400 font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.5 + categoryIndex * 0.1 + index * 0.05, ease: "easeOut" }}
                      className="h-full rounded-full relative"
                      style={{ backgroundColor: getSkillColor(skill.proficiency) }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {!loading && !error && skills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">💻</div>
            <p className="text-gray-400 text-lg">No skills data available yet.</p>
          </motion.div>
        )}

        {/* Additional Info */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4">
                Always Learning
              </h4>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Technology evolves rapidly, and I'm committed to continuous learning. 
                Currently exploring AI/ML integration, Web3 technologies, and advanced 3D web experiences.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Skills