'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { ExternalLink, Github, Eye, Rocket, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface ProjectData {
  id: string
  title: string
  slug?: string
  description: string
  longDescription?: string
  projectType?: 'webapp' | 'android' | 'desktop' | 'api'
  lifecycleStatus?: string
  publishStatus?: string
  logoUrl?: string
  coverImage?: string
  technologies: string[]
  techStack?: Array<{ name: string; category: string; icon?: string }>
  githubUrl?: string
  demoUrl?: string
  clientProjectUrl?: string
  adminProjectUrl?: string
  clientLiveUrl?: string
  adminLiveUrl?: string
  androidDownloadUrl?: string
  githubUrlEnabled?: boolean
  demoUrlEnabled?: boolean
  clientProjectUrlEnabled?: boolean
  adminProjectUrlEnabled?: boolean
  clientLiveUrlEnabled?: boolean
  adminLiveUrlEnabled?: boolean
  androidDownloadUrlEnabled?: boolean
  featured: boolean
  order: number
  overallProgress?: number
  createdAt: string
  updatedAt: string
}

const ProjectCard = ({ project, index, isInView, isFeatured = false }: { 
  project: ProjectData, 
  index: number, 
  isInView: boolean,
  isFeatured?: boolean 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const technologies = project.techStack && project.techStack.length > 0 
    ? project.techStack.map(t => t.name)
    : project.technologies || []

  const getProjectTypeStyles = (type?: string) => {
    switch (type) {
      case 'android':
        return { bg: 'from-emerald-500/20 to-green-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' }
      case 'api':
        return { bg: 'from-purple-500/20 to-violet-500/20', text: 'text-purple-400', border: 'border-purple-500/30' }
      default:
        return { bg: 'from-sky-500/20 to-blue-500/20', text: 'text-sky-400', border: 'border-sky-500/30' }
    }
  }

  const typeStyles = getProjectTypeStyles(project.projectType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden ${
        isFeatured ? 'md:col-span-1' : ''
      }`}
    >
      {/* Card container */}
      <div className="relative h-full bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-500 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/[0.08]" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Image section */}
        <div className={`relative overflow-hidden ${isFeatured ? 'h-56 md:h-64' : 'h-48'}`}>
          {(project.coverImage) ? (
            <Image
              src={project.coverImage || ''}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              fill
              unoptimized
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${typeStyles.bg} flex items-center justify-center`}>
              <Rocket size={48} className="text-white/30" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          {/* Progress badge */}
          {project.overallProgress !== undefined && project.overallProgress > 0 && project.overallProgress < 100 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10"
            >
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.overallProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-xs text-white/80 font-medium">{project.overallProgress}%</span>
            </motion.div>
          )}

          {/* Project type & status badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${typeStyles.bg} ${typeStyles.text} border ${typeStyles.border} backdrop-blur-sm`}>
              {project.projectType === 'android' ? '📱 Android' : project.projectType === 'api' ? '⚡ API' : '🌐 Web App'}
            </span>
            {project.lifecycleStatus && project.lifecycleStatus !== 'live' && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                project.lifecycleStatus === 'development' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                project.lifecycleStatus === 'testing' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {project.lifecycleStatus.charAt(0).toUpperCase() + project.lifecycleStatus.slice(1)}
              </span>
            )}
          </div>

          {/* Quick action buttons (visible on hover) */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {project.demoUrlEnabled !== false && project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-400 transition-colors shadow-lg"
              >
                <ExternalLink size={20} />
              </motion.a>
            )}
            {project.githubUrlEnabled !== false && project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors shadow-lg"
              >
                <Github size={20} />
              </motion.a>
            )}
            {project.clientLiveUrlEnabled && project.clientLiveUrl && (
              <motion.a
                href={project.clientLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="p-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 transition-colors shadow-lg"
                title="Client Live"
              >
                <ExternalLink size={20} />
              </motion.a>
            )}
            {project.adminLiveUrlEnabled && project.adminLiveUrl && (
              <motion.a
                href={project.adminLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="p-3 rounded-full bg-orange-500 text-white hover:bg-orange-400 transition-colors shadow-lg"
                title="Admin Live"
              >
                <ExternalLink size={20} />
              </motion.a>
            )}
            {project.androidDownloadUrlEnabled && project.androidDownloadUrl && (
              <motion.a
                href={project.androidDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="p-3 rounded-full bg-green-500 text-white hover:bg-green-400 transition-colors shadow-lg"
                title="Android App"
              >
                <ExternalLink size={20} />
              </motion.a>
            )}
            {project.slug && (
              <motion.a
                href={`/projects/${project.slug}`}
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="p-3 rounded-full bg-purple-500 text-white hover:bg-purple-400 transition-colors shadow-lg"
              >
                <Eye size={20} />
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Content section */}
        <div className="p-6">
          {/* Title with logo */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
              {project.logoUrl ? (
                <Image src={project.logoUrl} alt={`${project.title} logo`} className="w-full h-full object-cover" width={40} height={40} unoptimized />
              ) : (
                <span className="text-sm text-white/70 font-bold">{project.title.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {project.title}
            </h4>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {technologies.slice(0, isFeatured ? 5 : 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 bg-white/5 text-gray-400 rounded-lg text-xs font-medium border border-white/5 group-hover:border-white/10 transition-colors"
              >
                {tech}
              </span>
            ))}
            {technologies.length > (isFeatured ? 5 : 4) && (
              <span className="px-2.5 py-1 text-gray-500 text-xs">
                +{technologies.length - (isFeatured ? 5 : 4)}
              </span>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 flex-wrap">
              {project.githubUrlEnabled !== false && project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors"
                >
                  <Github size={16} />
                  <span>Code</span>
                </a>
              )}
              {project.demoUrlEnabled !== false && project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-500 hover:text-blue-400 text-sm transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Demo</span>
                </a>
              )}
              {project.clientLiveUrlEnabled && project.clientLiveUrl && (
                <a
                  href={project.clientLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-400 text-sm transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Client</span>
                </a>
              )}
              {project.adminLiveUrlEnabled && project.adminLiveUrl && (
                <a
                  href={project.adminLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-500 hover:text-orange-400 text-sm transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Admin</span>
                </a>
              )}
              {project.androidDownloadUrlEnabled && project.androidDownloadUrl && (
                <a
                  href={project.androidDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-500 hover:text-green-400 text-sm transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Android</span>
                </a>
              )}
            </div>
            {project.slug && (
              <a
                href={`/projects/${project.slug}`}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors group/link"
              >
                <span>Details</span>
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const fallbackProjects: ProjectData[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with Next.js, featuring real-time inventory, payment processing, and admin dashboard.',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'MongoDB', 'Tailwind CSS'],
      projectType: 'webapp',
      lifecycleStatus: 'live',
      githubUrl: '#',
      demoUrl: '#',
      featured: true,
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: '3D Portfolio Website',
      description: 'An interactive portfolio website with Three.js animations, particle systems, and immersive 3D elements.',
      technologies: ['React', 'Three.js', 'Framer Motion', 'WebGL', 'GLSL'],
      projectType: 'webapp',
      lifecycleStatus: 'live',
      githubUrl: '#',
      demoUrl: '#',
      featured: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  const displayProjects = projects.length > 0 ? projects : fallbackProjects
  const featuredProjects = displayProjects.filter(project => project.featured)
  const otherProjects = displayProjects.filter(project => !project.featured)

  return (
    <section id="projects" className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <Rocket size={14} className="text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">My Work</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-400/80 max-w-2xl mx-auto">
            {loading ? 'Loading projects...' : `Explore ${displayProjects.length} projects showcasing my skills and passion for development.`}
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {!loading && featuredProjects.length > 0 && (
          <div className="mb-16">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              className="text-2xl font-bold text-white mb-8 flex items-center gap-3"
            >
              <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              Featured Work
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} isInView={isInView} isFeatured />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {!loading && otherProjects.length > 0 && (
          <div>
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-8 flex items-center gap-3"
            >
              <span className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              Other Projects
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} isInView={isInView} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/10">
            <p className="text-gray-400">
              Want to see more or discuss a project?
            </p>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2 transition-all duration-300"
              onClick={() => {
                const contactSection = document.querySelector('#contact')
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              Get In Touch
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
