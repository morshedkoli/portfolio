'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Code,
  Zap,
  LayoutDashboard,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Facebook,
  Youtube,
  Menu,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Upload,
  Briefcase,
  GraduationCap,
  Mail,
  Pencil
} from 'lucide-react'
import Link from 'next/link'

// --- Interfaces ---

interface Project {
  id: string
  title: string
  slug?: string
  description: string
  technologies: string[]
  techStack?: Array<{ name: string; category: string; icon?: string }>
  projectType?: ProjectType
  lifecycleStatus?: string
  publishStatus?: string
  logoUrl?: string
  coverImage?: string
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  featured: boolean
  overallProgress?: number
}

type ProjectType = 'webapp' | 'android' | 'desktop' | 'api'

interface Profile {
  id?: string
  name: string
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  heroImage?: string
  resume?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
    facebook?: string
    youtube?: string
  }
}

interface Skill {
  id?: string
  name: string
  category: string
  proficiency: number
  icon?: string
  order: number
}

interface Experience {
  id?: string
  company: string
  position: string
  description: string
  startDate: string
  endDate?: string
  current: boolean
  location?: string
  order: number
}

interface Education {
  id?: string
  institution: string
  degree: string
  field?: string
  description?: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  order: number
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
}

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, handleLogout, mobileMenuOpen, setMobileMenuOpen, unreadCount = 0 }: any) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'messages', label: 'Messages', icon: Mail, badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 md:hidden backdrop-blur-sm bg-black/60"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 bg-zinc-950 border-r border-zinc-800 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              A
            </div>
            <span>Admin<span className="text-zinc-500">Panel</span></span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
              >
                <Icon size={18} />
                {item.label}
                {item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{item.badge}</span>
                )}
                {isActive && !item.badge && <ChevronRight size={14} className="ml-auto" />}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  )
}

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors group"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-zinc-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  </motion.div>
)

// --- Main Dashboard Component ---

export default function AdminDashboard() {
  const technologyOptionsByType: Record<ProjectType, string[]> = {
    webapp: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'PostgreSQL',
      'Prisma',
      'Tailwind CSS',
      'Framer Motion',
      'Redux',
      'GraphQL',
      'Firebase',
      'Docker',
      'AWS',
      'Vercel',
      'Git',
    ],
    android: [
      'Kotlin',
      'Java',
      'Flutter',
      'Dart',
      'React Native',
      'Expo',
      'Jetpack Compose',
      'XML',
      'Android SDK',
      'Retrofit',
      'OkHttp',
      'Room',
      'SQLite',
      'Firebase',
      'Dagger Hilt',
      'Coroutines',
      'Flow',
      'LiveData',
      'ViewModel',
      'Gradle',
      'MVVM',
      'Git',
    ],
    desktop: [
      'Electron',
      'Tauri',
      'Python',
      'Qt',
      'C++',
      'C#',
      '.NET',
      'WPF',
      'JavaFX',
      'Rust',
      'SQLite',
    ],
    api: [
      'Node.js',
      'Express.js',
      'FastAPI',
      'Python',
      'Go',
      'Rust',
      'GraphQL',
      'REST',
      'gRPC',
      'MongoDB',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Kubernetes',
      'AWS Lambda',
    ],
  }

  const skillCategories = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'tools', label: 'Tools' },
    { value: 'languages', label: 'Languages' },
    { value: 'vibe-coding', label: 'Vibe Coding' },
    { value: 'ai', label: 'AI' },
  ]

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedTechnology, setSelectedTechnology] = useState(technologyOptionsByType.webapp[0])

  const detectProjectType = (project: Project): ProjectType => {
    if (project.projectType === 'android' || project.projectType === 'webapp') return project.projectType
    const hasAndroidTech = project.technologies.some((tech) => technologyOptionsByType.android.includes(tech))
    return hasAndroidTech ? 'android' : 'webapp'
  }
  const [editingProfile, setEditingProfile] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  // New State
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [educations, setEducations] = useState<Education[]>([])
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({})
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [editingSettings, setEditingSettings] = useState(false)
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: '',
    siteDescription: '',
    footerText: '',
    copyrightText: '',
    maintenanceMode: false,
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loginStatus = localStorage.getItem('adminLoggedIn')
    if (loginStatus !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [router])

  const fetchData = async () => {
    try {
      const [projectsRes, profileRes, skillsRes, expRes, eduRes, msgRes, settingsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/profile'),
        fetch('/api/skills'),
        fetch('/api/experience'),
        fetch('/api/education'),
        fetch('/api/contact'),
        fetch('/api/settings')
      ])

      if (projectsRes.status !== 404 && projectsRes.ok) setProjects(await projectsRes.json())
      if (profileRes.status !== 404 && profileRes.ok) setProfile(await profileRes.json())
      if (skillsRes.status !== 404 && skillsRes.ok) setSkills(await skillsRes.json())
      if (expRes.status !== 404 && expRes.ok) setExperiences(await expRes.json())
      if (eduRes.status !== 404 && eduRes.ok) setEducations(await eduRes.json())
      if (msgRes.status !== 404 && msgRes.ok) setMessages(await msgRes.json())
      if (settingsRes.status !== 404 && settingsRes.ok) {
        const s = await settingsRes.json()
        setSettings(s)
        setSettingsForm({
          siteTitle: s.siteTitle || '',
          siteDescription: s.siteDescription || '',
          footerText: s.footerText || '',
          copyrightText: s.copyrightText || '',
          maintenanceMode: s.maintenanceMode || false,
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    router.push('/admin/login')
  }

  const confirmWithToast = (message: string) => {
    return new Promise<boolean>((resolve) => {
      let resolved = false

      toast(message, {
        duration: 10000,
        action: {
          label: 'Confirm',
          onClick: () => {
            resolved = true
            resolve(true)
          },
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {
            resolved = true
            resolve(false)
          },
        },
        onDismiss: () => {
          if (!resolved) resolve(false)
        },
      })
    })
  }

  // --- Actions ---

  const handleSaveExperience = async () => {
    if (!editingExperience) return
    setLoading(true)
    try {
      const url = editingExperience.id ? `/api/experience` : '/api/experience'
      const method = editingExperience.id ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingExperience),
      })
      if (response.ok) {
        setEditingExperience(null)
        await fetchData()
        toast.success('Experience saved.')
      } else {
        toast.error('Could not save experience.')
      }
    } catch (error) {
      console.error('Error saving experience:', error)
      toast.error('Could not save experience.')
    } finally {
      setLoading(false)
    }
  }

  const deleteExperience = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this experience?')
    if (!confirmed) return
    setLoading(true)
    try {
      const response = await fetch(`/api/experience?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Experience deleted.')
      } else {
        toast.error('Could not delete experience.')
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
      toast.error('Could not delete experience.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEducation = async () => {
    if (!editingEducation) return
    setLoading(true)
    try {
      const url = editingEducation.id ? `/api/education` : '/api/education'
      const method = editingEducation.id ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEducation),
      })
      if (response.ok) {
        setEditingEducation(null)
        await fetchData()
        toast.success('Education saved.')
      } else {
        toast.error('Could not save education.')
      }
    } catch (error) {
      console.error('Error saving education:', error)
      toast.error('Could not save education.')
    } finally {
      setLoading(false)
    }
  }

  const deleteEducation = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this education item?')
    if (!confirmed) return
    setLoading(true)
    try {
      const response = await fetch(`/api/education?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Education deleted.')
      } else {
        toast.error('Could not delete education.')
      }
    } catch (error) {
      console.error('Error deleting education:', error)
      toast.error('Could not delete education.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProject = async (project: Project) => {
    setLoading(true)
    try {
      const method = project.id ? 'PUT' : 'POST'
      const url = project.id ? `/api/projects/${project.id}` : '/api/projects'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })

      if (response.ok) {
        await fetchData()
        setEditingProject(null)
        toast.success('Project saved.')
      } else {
        toast.error('Could not save project.')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Could not save project.')
    }
    setLoading(false)
  }

  const handleDeleteProject = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this project?')
    if (!confirmed) return
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Project deleted.')
      } else {
        toast.error('Could not delete project.')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Could not delete project.')
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      if (response.ok) {
        setEditingProfile(false)
        await fetchData()
        toast.success('Profile saved.')
      } else {
        toast.error('Could not save profile.')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Could not save profile.')
    }
    setLoading(false)
  }

  const saveSkill = async () => {
    if (!editingSkill) return
    setLoading(true)
    try {
      const url = editingSkill.id ? `/api/skills/${editingSkill.id}` : '/api/skills'
      const method = editingSkill.id ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSkill),
      })
      if (response.ok) {
        setEditingSkill(null)
        await fetchData()
        toast.success('Skill saved.')
      } else {
        toast.error('Could not save skill.')
      }
    } catch (error) {
      console.error('Error saving skill:', error)
      toast.error('Could not save skill.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && profile) {
          setProfile({ ...profile, heroImage: data.url })
        }
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const deleteSkill = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this skill?')
    if (!confirmed) return
    setLoading(true)
    try {
      const response = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Skill deleted.')
      } else {
        toast.error('Could not delete skill.')
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error('Could not delete skill.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this message?')
    if (!confirmed) return
    try {
      const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchData()
        toast.success('Message deleted.')
      } else {
        toast.error('Could not delete message.')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Could not delete message.')
    }
  }

  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchData()
        toast.success(`Message status set to ${status}.`)
      } else {
        toast.error('Could not update message status.')
      }
    } catch (error) {
      console.error('Error updating message status:', error)
      toast.error('Could not update message status.')
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      for (const [key, value] of Object.entries(settingsForm)) {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      }
      setEditingSettings(false)
      await fetchData()
      toast.success('Settings saved.')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Could not save settings.')
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length

  if (!isAuthenticated) return <div className="min-h-screen bg-black" />

  return (
    <div className="admin-dashboard min-h-screen font-sans bg-black text-zinc-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-30 backdrop-blur-md px-6 py-4 flex items-center justify-between bg-black/80 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-zinc-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-semibold capitalize tracking-tight">{activeTab}</h2>
          </div>

          {/* Header Actions per tab could go here */}
          {activeTab === 'projects' && !editingProject && (
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <Plus size={16} /> New Project
            </Link>
          )}
          {activeTab === 'skills' && !editingSkill && (
            <button
              onClick={() => setEditingSkill({
                name: '', category: 'frontend',
                proficiency: 50, icon: '', order: skills.length
              })}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <Plus size={16} /> New Skill
            </button>
          )}
        </header>

        <div className="p-6 max-w-7xl mx-auto">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Projects" value={projects.length} icon={FileText} color="bg-blue-500" delay={0} />
                <StatCard title="Featured" value={projects.filter(p => p.featured).length} icon={Eye} color="bg-green-500" delay={0.05} />
                <StatCard title="Skills" value={skills.length} icon={Zap} color="bg-orange-500" delay={0.1} />
                <StatCard title="Experience" value={experiences.length} icon={Briefcase} color="bg-cyan-500" delay={0.15} />
                <StatCard title="Education" value={educations.length} icon={GraduationCap} color="bg-indigo-500" delay={0.2} />
                <StatCard title="Unread Messages" value={unreadCount} icon={Mail} color="bg-red-500" delay={0.25} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Recent Messages */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-zinc-300">Recent Messages</h3>
                    <button onClick={() => setActiveTab('messages')} className="text-xs text-blue-400 hover:text-blue-300">View All</button>
                  </div>
                  <div className="space-y-3">
                    {messages.length === 0 && <p className="text-zinc-600 text-sm">No messages yet.</p>}
                    {messages.slice(0, 3).map((msg) => (
                      <div key={msg.id} className={`p-3 rounded-lg border ${msg.status === 'unread' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-zinc-950 border-zinc-800'}`}>
                        <div className="flex justify-between items-center mb-1 gap-2">
                          <span className="text-sm font-medium text-zinc-200 truncate">{msg.name}</span>
                          <span className="text-[11px] text-zinc-500 shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <p className="text-xs text-zinc-500 truncate">{msg.subject || 'No subject'}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${msg.status === 'unread' ? 'bg-blue-500/20 text-blue-400' : msg.status === 'replied' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}>{msg.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 text-zinc-300">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { tab: 'projects', icon: FileText, label: 'Projects', color: 'text-blue-500' },
                      { tab: 'skills', icon: Zap, label: 'Skills', color: 'text-orange-500' },
                      { tab: 'profile', icon: Users, label: 'Profile', color: 'text-purple-500' },
                      { tab: 'experience', icon: Briefcase, label: 'Experience', color: 'text-cyan-500' },
                      { tab: 'education', icon: GraduationCap, label: 'Education', color: 'text-indigo-500' },
                      { tab: 'messages', icon: Mail, label: 'Messages', color: 'text-red-500' },
                    ].map(({ tab, icon: Icon, label, color }) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors text-left flex flex-col gap-2">
                        <Icon className={color} size={20} />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  {!editingProfile ? (
                    <button onClick={() => setEditingProfile(true)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors border border-zinc-700">
                      <Edit size={14} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProfile(false)} className="px-3 py-1.5 text-zinc-400 hover:text-white text-sm">Cancel</button>
                      <button onClick={handleSaveProfile} disabled={loading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                        <Save size={14} /> Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {profile && (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Full Name</label>
                        {editingProfile ? (
                          <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" />
                        ) : (
                          <p className="p-2 text-zinc-300">{profile.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Title</label>
                        {editingProfile ? (
                          <input type="text" value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" />
                        ) : (
                          <p className="p-2 text-zinc-300">{profile.title}</p>
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Bio</label>
                        {editingProfile ? (
                          <textarea rows={4} value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none" />
                        ) : (
                          <p className="p-2 text-zinc-300 leading-relaxed">{profile.description}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</label>
                        {editingProfile ? (
                          <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" />
                        ) : (
                          <p className="p-2 text-zinc-300">{profile.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Location</label>
                        {editingProfile ? (
                          <input type="text" value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" />
                        ) : (
                          <p className="p-2 text-zinc-300">{profile.location || 'Not set'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone</label>
                        {editingProfile ? (
                          <input type="text" value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. +880 1XXX-XXXXXX" />
                        ) : (
                          <p className="p-2 text-zinc-300">{profile.phone || 'Not set'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Hero Image URL</label>
                        {editingProfile ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={profile.heroImage || ''}
                                onChange={e => setProfile({ ...profile, heroImage: e.target.value })}
                                className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                                placeholder="/image.png"
                              />
                              <label className="cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors border border-zinc-700 flex items-center gap-2">
                                {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Upload size={16} />}
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                  disabled={uploading}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-zinc-500">
                              Upload an image directly or paste a URL.
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                              {profile.heroImage ? (
                                <Image src={profile.heroImage} alt="Hero" className="w-full h-full object-cover" width={40} height={40} unoptimized />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">N/A</div>
                              )}
                            </div>
                            <p className="p-2 text-zinc-300 truncate text-sm flex-1">{profile.heroImage || 'Default Image'}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Resume URL</label>
                        {editingProfile ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={profile.resume || ''}
                              onChange={e => setProfile({ ...profile, resume: e.target.value })}
                              className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                              placeholder="/resume.pdf"
                            />
                            <label className="cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors border border-zinc-700 flex items-center gap-2">
                              {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Upload size={16} />}
                              Upload
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0]
                                  if (!file) return
                                  setUploading(true)
                                  const formData = new FormData()
                                  formData.append('file', file)
                                  try {
                                    const response = await fetch('/api/upload', { method: 'POST', body: formData })
                                    if (response.ok) {
                                      const data = await response.json()
                                      if (data.success) setProfile({ ...profile, resume: data.url })
                                    }
                                  } catch (error) {
                                    console.error('Error uploading resume:', error)
                                  } finally {
                                    setUploading(false)
                                  }
                                }}
                                disabled={uploading}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="p-2 text-zinc-300 truncate flex-1">{profile.resume || 'Not set'}</p>
                            {profile.resume && (
                              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded hover:bg-zinc-700 text-white">
                                <Eye size={16} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                      <h4 className="font-semibold mb-4 flex items-center gap-2"><Globe size={16} className="text-zinc-500" /> Social Connections</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'github', label: 'GitHub', icon: Github },
                          { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                          { key: 'twitter', label: 'Twitter', icon: Twitter },
                          { key: 'website', label: 'Website', icon: Globe },
                        ].map(({ key, label, icon: Icon }) => {
                          const val = profile.socialLinks?.[key as keyof typeof profile.socialLinks] || ''
                          return (
                            <div key={key} className="space-y-1">
                              <label className="text-xs text-zinc-500 ml-1">{label}</label>
                              {editingProfile ? (
                                <div className="relative">
                                  <Icon size={16} className="absolute left-3 top-3 text-zinc-600" />
                                  <input
                                    type="url"
                                    value={val}
                                    onChange={e => setProfile({
                                      ...profile,
                                      socialLinks: { ...profile.socialLinks, [key]: e.target.value }
                                    })}
                                    className="w-full pl-10 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder={`https://${key}.com/...`}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                                  <Icon size={16} className="text-zinc-500" />
                                  <span className="text-sm truncate text-zinc-300">{val || 'Not linked'}</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {editingProject && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 shadow-2xl relative"
                >
                  <button onClick={() => setEditingProject(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                    <X size={20} />
                  </button>
                  <h3 className="text-lg font-semibold mb-6">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Project Title</label>
                        <input
                          value={editingProject.title}
                          onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none"
                          placeholder="My Awesome Project"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Description</label>
                        <textarea
                          value={editingProject.description}
                          onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                          rows={4}
                          placeholder="What does this project do?"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Project Type</label>
                        <select
                          value={editingProject.projectType || 'webapp'}
                          onChange={(e) => {
                            const nextType = e.target.value as ProjectType
                            const nextOptions = technologyOptionsByType[nextType]
                            setEditingProject({
                              ...editingProject,
                              projectType: nextType,
                              technologies: editingProject.technologies.filter((tech) => nextOptions.includes(tech)),
                            })
                            setSelectedTechnology(nextOptions[0])
                          }}
                          className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none"
                        >
                          <option value="webapp">Web App</option>
                          <option value="android">Android</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Technologies</label>
                        {(() => {
                          const currentType = editingProject.projectType || 'webapp'
                          const typeTechnologies = technologyOptionsByType[currentType]
                          const availableTechnologies = typeTechnologies.filter(
                            (tech) => !editingProject.technologies.includes(tech)
                          )

                          return (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <select
                                  value={availableTechnologies.length === 0
                                    ? ''
                                    : (availableTechnologies.includes(selectedTechnology) ? selectedTechnology : availableTechnologies[0])}
                                  onChange={(e) => setSelectedTechnology(e.target.value)}
                                  className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none"
                                  disabled={availableTechnologies.length === 0}
                                >
                                  {availableTechnologies.length === 0 ? (
                                    <option value="">All technologies added</option>
                                  ) : (
                                    availableTechnologies.map((tech) => (
                                      <option key={tech} value={tech}>{tech}</option>
                                    ))
                                  )}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const techToAdd = availableTechnologies.includes(selectedTechnology)
                                      ? selectedTechnology
                                      : availableTechnologies[0]
                                    if (!techToAdd) return
                                    setEditingProject({
                                      ...editingProject,
                                      technologies: [...editingProject.technologies, techToAdd],
                                    })
                                    const remaining = availableTechnologies.filter((tech) => tech !== techToAdd)
                                    if (remaining.length > 0) setSelectedTechnology(remaining[0])
                                  }}
                                  disabled={availableTechnologies.length === 0}
                                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Add
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 min-h-[36px]">
                                {editingProject.technologies.length === 0 && (
                                  <span className="text-xs text-zinc-500">No technologies selected.</span>
                                )}
                                {editingProject.technologies.map((tech) => (
                                  <button
                                    type="button"
                                    key={tech}
                                    onClick={() => {
                                      const updated = editingProject.technologies.filter((item) => item !== tech)
                                      setEditingProject({ ...editingProject, technologies: updated })
                                      if (!updated.includes(selectedTechnology)) {
                                        setSelectedTechnology(tech)
                                      }
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-300 hover:border-zinc-700 transition-colors"
                                    title="Remove technology"
                                  >
                                    {tech}
                                    <X size={12} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Project Icon / Logo (optional)</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                            {editingProject.logoUrl ? (
                              <Image src={editingProject.logoUrl} alt="Logo" className="w-full h-full object-cover" width={40} height={40} unoptimized />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-zinc-700 text-xs font-semibold">
                                {editingProject.title?.charAt(0)?.toUpperCase() || 'L'}
                              </div>
                            )}
                          </div>
                          <label className="cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors border border-zinc-700 flex items-center gap-2">
                            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Upload size={16} />}
                            Upload Logo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setUploading(true)
                                const formData = new FormData()
                                formData.append('file', file)
                                try {
                                  const response = await fetch('/api/upload', { method: 'POST', body: formData })
                                  if (response.ok) {
                                    const data = await response.json()
                                    if (data.success) setEditingProject({ ...editingProject, logoUrl: data.url })
                                  }
                                } catch (error) {
                                  console.error('Error uploading project logo:', error)
                                } finally {
                                  setUploading(false)
                                }
                              }}
                              disabled={uploading}
                            />
                          </label>
                          {editingProject.logoUrl && (
                            <button
                              onClick={() => setEditingProject({ ...editingProject, logoUrl: '' })}
                              className="p-2 hover:bg-zinc-800 rounded-lg text-red-400"
                              title="Remove Logo"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">Project Preview Image</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-10 bg-zinc-950 border border-zinc-800 rounded overflow-hidden flex-shrink-0">
                            {editingProject.imageUrl ? (
                              <Image src={editingProject.imageUrl} alt="Preview" className="w-full h-full object-cover" width={64} height={40} unoptimized />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-zinc-700">
                                <FileText size={16} />
                              </div>
                            )}
                          </div>
                          <label className="cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors border border-zinc-700 flex items-center gap-2">
                            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Upload size={16} />}
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setUploading(true)
                                const formData = new FormData()
                                formData.append('file', file)
                                try {
                                  const response = await fetch('/api/upload', { method: 'POST', body: formData })
                                  if (response.ok) {
                                    const data = await response.json()
                                    if (data.success) setEditingProject({ ...editingProject, imageUrl: data.url })
                                  }
                                } catch (error) {
                                  console.error('Error uploading project image:', error)
                                } finally {
                                  setUploading(false)
                                }
                              }}
                              disabled={uploading}
                            />
                          </label>
                          {editingProject.imageUrl && (
                            <button
                              onClick={() => setEditingProject({ ...editingProject, imageUrl: '' })}
                              className="p-2 hover:bg-zinc-800 rounded-lg text-red-400"
                              title="Remove Image"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">GitHub URL</label>
                          <input
                            value={editingProject.githubUrl || ''}
                            onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">Demo URL</label>
                          <input
                            value={editingProject.demoUrl || ''}
                            onChange={e => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-600 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={editingProject.featured}
                          onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900"
                        />
                        <label htmlFor="featured" className="text-sm cursor-pointer select-none">Feature this project on homepage</label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setEditingProject(null)} className="px-4 py-2 text-zinc-400 hover:text-white text-sm">Cancel</button>
                    <button onClick={() => handleSaveProject(editingProject)} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save size={16} />}
                      Save Project
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const technologies = project.techStack && project.techStack.length > 0
                    ? project.techStack.map(t => t.name)
                    : project.technologies || []
                  
                  const lifecycleColors: Record<string, string> = {
                    idea: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
                    planning: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    design: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
                    development: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                    testing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
                    deployment: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
                    live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }

                  return (
                    <motion.div
                      layout
                      key={project.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-600 transition-colors flex flex-col"
                    >
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-lg ${project.featured ? 'bg-orange-500/10 text-orange-400' : 'bg-zinc-800 text-zinc-400'}`}>
                            {project.featured ? <Zap size={20} /> : <Code size={20} />}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/admin/projects/${project.id}`}
                              className="p-2 hover:bg-zinc-800 rounded-lg text-blue-400"
                            >
                              <Edit size={16} />
                            </Link>
                            {/* Delete button disabled */}
                            {/* <button onClick={() => handleDeleteProject(project.id)} className="p-2 hover:bg-zinc-800 rounded-lg text-red-400"><Trash2 size={16} /></button> */}
                          </div>
                        </div>
                        <div className="flex items-start justify-between gap-3 mb-2 p-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md border border-zinc-700 overflow-hidden bg-zinc-950 flex items-center justify-center shrink-0">
                              {project.logoUrl ? (
                                <Image src={project.logoUrl} alt={`${project.title} logo`} className="w-full h-full object-cover" width={28} height={28} unoptimized />
                              ) : (
                                <span className="text-[10px] text-zinc-500 font-semibold">{project.title.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold truncate">{project.title}</h3>
                          </div>
                        </div>
                        
                        {/* Status badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span
                            className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              project.projectType === 'android'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : project.projectType === 'api'
                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                            }`}
                          >
                            {project.projectType === 'android' ? 'Android' : project.projectType === 'api' ? 'API' : 'Web App'}
                          </span>
                          {project.lifecycleStatus && (
                            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${lifecycleColors[project.lifecycleStatus] || lifecycleColors.idea}`}>
                              {project.lifecycleStatus}
                            </span>
                          )}
                          {project.publishStatus === 'draft' && (
                            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border bg-zinc-500/10 text-zinc-400 border-zinc-500/30">
                              Draft
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        {project.overallProgress !== undefined && project.overallProgress > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-zinc-500">Progress</span>
                              <span className="text-[10px] text-zinc-400">{project.overallProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                                style={{ width: `${project.overallProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {technologies.slice(0, 3).map((t, i) => (
                            <span key={i} className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-500">{t}</span>
                          ))}
                          {technologies.length > 3 && <span className="px-2 py-1 text-xs text-zinc-600">+{technologies.length - 3}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {editingSkill && !editingSkill.id && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">{editingSkill.id ? 'Edit Skill' : 'Add New Skill'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="col-span-2">
                      <label className="text-xs text-zinc-500 mb-1 block">Skill Name</label>
                      <input
                        value={editingSkill.name}
                        onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Icon</label>
                      <input
                        value={editingSkill.icon || ''}
                        onChange={e => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                        placeholder="e.g. ⚛️"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Category</label>
                      <select
                        value={editingSkill.category}
                        onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                      >
                        {skillCategories.map((category) => (
                          <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Proficiency ({editingSkill.proficiency}%)</label>
                      <input
                        type="range"
                        min="0" max="100"
                        value={editingSkill.proficiency}
                        onChange={e => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 justify-end">
                    <button onClick={() => setEditingSkill(null)} className="px-3 py-1.5 text-zinc-400 text-sm">Cancel</button>
                    <button onClick={saveSkill} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">Save Skill</button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skillCategories.map(category => {
                  const catSkills = skills.filter(s => s.category === category.value)
                  if (catSkills.length === 0 && !editingSkill) return null
                  return (
                    <div key={category.value} className="space-y-3">
                      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {category.label}
                      </h3>
                      <div className="space-y-2">
                        {catSkills.map(skill => (
                          editingSkill?.id === skill.id ? (
                            <motion.div key={skill.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-blue-500/40 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                <div className="md:col-span-2">
                                  <label className="text-xs text-zinc-500 mb-1 block">Skill Name</label>
                                  <input
                                    value={editingSkill!.name}
                                    onChange={e => setEditingSkill({ ...editingSkill!, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-zinc-500 mb-1 block">Icon</label>
                                  <input
                                    value={editingSkill!.icon || ''}
                                    onChange={e => setEditingSkill({ ...editingSkill!, icon: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                                    placeholder="e.g. ⚛️"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-zinc-500 mb-1 block">Category</label>
                                  <select
                                    value={editingSkill!.category}
                                    onChange={e => setEditingSkill({ ...editingSkill!, category: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                                  >
                                    {skillCategories.map((category) => (
                                      <option key={category.value} value={category.value}>{category.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="text-xs text-zinc-500 mb-1 block">Proficiency ({editingSkill!.proficiency}%)</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={editingSkill!.proficiency}
                                    onChange={e => setEditingSkill({ ...editingSkill!, proficiency: parseInt(e.target.value) })}
                                    className="w-full accent-blue-600"
                                  />
                                </div>
                              </div>
                              <div className="mt-3 flex justify-end gap-2">
                                <button onClick={() => setEditingSkill(null)} className="px-3 py-1.5 text-zinc-400 text-sm">Cancel</button>
                                <button onClick={saveSkill} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">Save Skill</button>
                              </div>
                            </motion.div>
                          ) : (
                            <div key={skill.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-zinc-950 flex items-center justify-center text-zinc-400 font-bold text-xs border border-zinc-800">
                                  {skill.icon ? (
                                    <span className="text-base leading-none">{skill.icon}</span>
                                  ) : (
                                    skill.name.substring(0, 2).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-zinc-200">{skill.name}</p>
                                  <div className="w-24 h-1 bg-zinc-800 rounded-full mt-1.5">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingSkill(skill)} className="p-1.5 hover:bg-zinc-800 rounded text-blue-400"><Edit size={14} /></button>
                                <button onClick={() => deleteSkill(skill.id!)} className="p-1.5 hover:bg-zinc-800 rounded text-red-400"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          )
                        ))}
                        {catSkills.length === 0 && <p className="text-zinc-600 text-sm italic">No skills in this category</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Experience</h3>
                {!editingExperience && (
                  <button
                    onClick={() => setEditingExperience({
                      company: '', position: '', description: '',
                      startDate: '', current: false, order: experiences.length
                    })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Plus size={16} /> Add Experience
                  </button>
                )}
              </div>

              {editingExperience && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">{editingExperience.id ? 'Edit Experience' : 'Add New Experience'}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Company</label>
                        <input
                          value={editingExperience.company}
                          onChange={e => setEditingExperience({ ...editingExperience, company: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Position</label>
                        <input
                          value={editingExperience.position}
                          onChange={e => setEditingExperience({ ...editingExperience, position: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Description</label>
                      <textarea
                        value={editingExperience.description}
                        onChange={e => setEditingExperience({ ...editingExperience, description: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500 min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={editingExperience.startDate ? new Date(editingExperience.startDate).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingExperience({ ...editingExperience, startDate: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={editingExperience.endDate ? new Date(editingExperience.endDate).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingExperience({ ...editingExperience, endDate: e.target.value })}
                          disabled={editingExperience.current}
                          className={`w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500 ${editingExperience.current ? 'opacity-50' : ''}`}
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingExperience.current}
                            onChange={e => setEditingExperience({ ...editingExperience, current: e.target.checked })}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900"
                          />
                          <span className="text-sm">Current Position</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Location</label>
                      <input
                        value={editingExperience.location || ''}
                        onChange={e => setEditingExperience({ ...editingExperience, location: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setEditingExperience(null)} className="px-4 py-2 text-zinc-400 hover:text-white text-sm">Cancel</button>
                    <button onClick={handleSaveExperience} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                      <Save size={16} /> Save Experience
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <motion.div
                    key={exp.id}
                    layout
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 group hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">{exp.position}</h4>
                        <h5 className="text-lg text-blue-400 mb-2">{exp.company}</h5>
                        <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                          <span>{new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate!).toLocaleDateString()}</span>
                          {exp.location && <span>• {exp.location}</span>}
                        </div>
                        <p className="text-zinc-300 whitespace-pre-line">{exp.description}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingExperience(exp)} className="p-2 hover:bg-zinc-800 rounded-lg text-blue-400"><Edit size={16} /></button>
                        <button onClick={() => deleteExperience(exp.id!)} className="p-2 hover:bg-zinc-800 rounded-lg text-red-400"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Education</h3>
                {!editingEducation && (
                  <button
                    onClick={() => setEditingEducation({
                      institution: '', degree: '', field: '', description: '',
                      startDate: '', current: false, order: educations.length
                    })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Plus size={16} /> Add Education
                  </button>
                )}
              </div>

              {editingEducation && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">{editingEducation.id ? 'Edit Education' : 'Add New Education'}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Institution</label>
                        <input
                          value={editingEducation.institution}
                          onChange={e => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Degree</label>
                        <input
                          value={editingEducation.degree}
                          onChange={e => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Field of Study</label>
                      <input
                        value={editingEducation.field || ''}
                        onChange={e => setEditingEducation({ ...editingEducation, field: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Description</label>
                      <textarea
                        value={editingEducation.description || ''}
                        onChange={e => setEditingEducation({ ...editingEducation, description: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500 min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={editingEducation.startDate ? new Date(editingEducation.startDate).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingEducation({ ...editingEducation, startDate: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={editingEducation.endDate ? new Date(editingEducation.endDate).toISOString().split('T')[0] : ''}
                          onChange={e => setEditingEducation({ ...editingEducation, endDate: e.target.value })}
                          disabled={editingEducation.current}
                          className={`w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500 ${editingEducation.current ? 'opacity-50' : ''}`}
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingEducation.current}
                            onChange={e => setEditingEducation({ ...editingEducation, current: e.target.checked })}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900"
                          />
                          <span className="text-sm">Current Student</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">GPA</label>
                      <input
                        value={editingEducation.gpa || ''}
                        onChange={e => setEditingEducation({ ...editingEducation, gpa: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setEditingEducation(null)} className="px-4 py-2 text-zinc-400 hover:text-white text-sm">Cancel</button>
                    <button onClick={handleSaveEducation} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
                      <Save size={16} /> Save Education
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                {educations.map((edu) => (
                  <motion.div
                    key={edu.id}
                    layout
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 group hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                        <h5 className="text-lg text-blue-400 mb-2">{edu.institution}</h5>
                        <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                          <span>{new Date(edu.startDate).toLocaleDateString()} - {edu.current ? 'Present' : new Date(edu.endDate!).toLocaleDateString()}</span>
                          {edu.gpa && <span>• GPA: {edu.gpa}</span>}
                        </div>
                        <p className="text-zinc-300 whitespace-pre-line">{edu.description}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingEducation(edu)} className="p-2 hover:bg-zinc-800 rounded-lg text-blue-400"><Edit size={16} /></button>
                        <button onClick={() => deleteEducation(edu.id!)} className="p-2 hover:bg-zinc-800 rounded-lg text-red-400"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Messages</h3>
                {unreadCount > 0 && <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">{unreadCount} unread</span>}
              </div>
              <div className="space-y-4">
                {messages.length === 0 && <p className="text-zinc-500">No messages yet.</p>}
                {messages.map((msg) => {
                  const isExpanded = expandedMessages[msg.id] ?? false
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`bg-zinc-900 border ${msg.status === 'unread' ? 'border-blue-500/50' : 'border-zinc-800'} rounded-xl p-6`}
                    >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{msg.name}</h4>
                        <p className="text-zinc-400 text-sm">{msg.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${msg.status === 'unread' ? 'bg-blue-500/20 text-blue-400' :
                            msg.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                              'bg-zinc-700 text-zinc-400'
                          }`}>{msg.status}</span>
                        <span className="text-xs text-zinc-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => setExpandedMessages((prev) => ({ ...prev, [msg.id]: !isExpanded }))}
                          className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                      </div>
                    </div>
                    {msg.subject && <h5 className="font-semibold text-zinc-200 mb-2">{msg.subject}</h5>}
                    {isExpanded ? (
                      <p className="text-zinc-300 whitespace-pre-wrap mb-4">{msg.message}</p>
                    ) : (
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{msg.message}</p>
                    )}
                    <div className="flex gap-2 pt-3 border-t border-zinc-800">
                      <button
                        onClick={() => handleUpdateMessageStatus(msg.id, 'read')}
                        disabled={msg.status === 'read'}
                        className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mark as Read
                      </button>
                      <button
                        onClick={() => handleUpdateMessageStatus(msg.id, 'replied')}
                        disabled={msg.status === 'replied'}
                        className="text-xs px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mark as Replied
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors ml-auto">Delete</button>
                    </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Site Settings</h3>
                  {!editingSettings ? (
                    <button onClick={() => setEditingSettings(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"><Pencil size={14} /> Edit</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingSettings(false); }} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm">Cancel</button>
                      <button onClick={handleSaveSettings} disabled={loading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Site Title</label>
                    {editingSettings ? (
                      <input type="text" value={settingsForm.siteTitle} onChange={e => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" placeholder="My Portfolio" />
                    ) : (
                      <p className="p-2 text-zinc-300">{settings.siteTitle || 'Not set'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">SEO Description</label>
                    {editingSettings ? (
                      <textarea value={settingsForm.siteDescription} onChange={e => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })} rows={3} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none" placeholder="Meta description for search engines" />
                    ) : (
                      <p className="p-2 text-zinc-300">{settings.siteDescription || 'Not set'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Footer Text</label>
                    {editingSettings ? (
                      <input type="text" value={settingsForm.footerText} onChange={e => setSettingsForm({ ...settingsForm, footerText: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Custom footer text" />
                    ) : (
                      <p className="p-2 text-zinc-300">{settings.footerText || 'Not set'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Copyright Text</label>
                    {editingSettings ? (
                      <input type="text" value={settingsForm.copyrightText} onChange={e => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" placeholder="All rights reserved." />
                    ) : (
                      <p className="p-2 text-zinc-300">{settings.copyrightText || 'Not set'}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                    <div>
                      <label className="text-sm font-medium text-zinc-300">Maintenance Mode</label>
                      <p className="text-xs text-zinc-500 mt-1">Show a maintenance page to visitors</p>
                    </div>
                    {editingSettings ? (
                      <button onClick={() => setSettingsForm({ ...settingsForm, maintenanceMode: !settingsForm.maintenanceMode })} className={`w-12 h-6 rounded-full transition-colors ${settingsForm.maintenanceMode ? 'bg-red-500' : 'bg-zinc-700'} relative`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settingsForm.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    ) : (
                      <span className={`text-sm font-medium ${settings.maintenanceMode ? 'text-red-400' : 'text-green-400'}`}>{settings.maintenanceMode ? 'On' : 'Off'}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  )
}
