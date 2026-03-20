'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Zap } from 'lucide-react'

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
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true)
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
        setSkills(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills')
        console.error('Error fetching skills:', err)
      } finally {
        setLoading(false)
      }
    }

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

  const categories = ['all', ...Object.keys(skillsByCategory)]

  const getSkillGradient = (proficiency: number) => {
    if (proficiency >= 90) return 'from-emerald-500 to-green-400'
    if (proficiency >= 75) return 'from-blue-500 to-cyan-400'
    if (proficiency >= 60) return 'from-amber-500 to-yellow-400'
    return 'from-rose-500 to-red-400'
  }

  const getSkillBorder = (proficiency: number) => {
    if (proficiency >= 90) return 'border-emerald-500/30 hover:border-emerald-400/50'
    if (proficiency >= 75) return 'border-blue-500/30 hover:border-blue-400/50'
    if (proficiency >= 60) return 'border-amber-500/30 hover:border-amber-400/50'
    return 'border-rose-500/30 hover:border-rose-400/50'
  }

  const formatCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: 'All Skills',
      ai: 'AI & ML',
      'vibe-coding': 'Vibe Coding',
      frontend: 'Frontend',
      backend: 'Backend',
      tools: 'Tools & DevOps',
      languages: 'Languages',
    }
    return labels[category] || category.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return '🤖'
      case 'frontend': return '🎨'
      case 'backend': return '⚙️'
      case 'tools': return '🛠️'
      case 'languages': return '💻'
      default: return '✨'
    }
  }

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeCategory)

  return (
    <section id="skills" className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 md:mb-6"
          >
            <Sparkles size={14} className="text-blue-400 md:size-4" />
            <span className="text-blue-400 text-xs md:text-sm font-medium">Technical Expertise</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-2">
            Here are the technologies and tools I work with to bring ideas to life.
          </p>
        </motion.div>

        {/* Category Filter */}
        {!loading && !error && skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {formatCategoryLabel(category)}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {/* Skills Grid */}
        {!loading && !error && filteredSkills.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredSkills
              .sort((a, b) => b.proficiency - a.proficiency)
              .map((skill, index) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl p-5 border ${getSkillBorder(skill.proficiency)} transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {skill.icon && (
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
                      )}
                      <div>
                        <h4 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">{skill.name}</h4>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                          {getCategoryIcon(skill.category)} {formatCategoryLabel(skill.category)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className={`${skill.proficiency >= 75 ? 'text-emerald-400' : 'text-gray-500'}`} />
                      <span className={`font-bold text-lg bg-gradient-to-r ${getSkillGradient(skill.proficiency)} bg-clip-text text-transparent`}>
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getSkillGradient(skill.proficiency)}`}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && skills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">💻</div>
            <p className="text-gray-400 text-lg">No skills data available yet.</p>
          </motion.div>
        )}

        {/* Always Learning Card */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 border border-white/10 p-8 md:p-10">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
              </div>

              <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Zap size={28} className="text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    Always Learning & Growing
                  </h4>
                  <p className="text-gray-400 max-w-2xl leading-relaxed">
                    Technology evolves rapidly, and I&apos;m committed to continuous learning. 
                    Currently exploring AI/ML integration, Web3 technologies, and advanced 3D web experiences 
                    to stay at the cutting edge of development.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Skills
