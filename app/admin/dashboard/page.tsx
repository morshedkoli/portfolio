'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
  Zap
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  technologiesInput?: string
  githubUrl?: string
  demoUrl?: string
  featured: boolean
}

interface Profile {
  id?: string
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

interface Skill {
  id?: string
  name: string
  category: string
  proficiency: number
  icon?: string
  order: number
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loginStatus = localStorage.getItem('adminLoggedIn')
    if (loginStatus !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, profileRes, skillsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/profile'),
        fetch('/api/skills')
      ])
      
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData)
      }
      
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
      }
      
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json()
        setSkills(skillsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    router.push('/admin/login')
  }

  const handleSaveProject = async (project: Project) => {
    setLoading(true)
    try {
      const method = project.id ? 'PUT' : 'POST'
      const url = project.id ? `/api/projects/${project.id}` : '/api/projects'
      
      // Clean up project data before sending to API
      const { technologiesInput, ...cleanProject } = project as any
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanProject)
      })
      
      if (response.ok) {
        await fetchData()
        setEditingProject(null)
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
    setLoading(false)
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
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
      }
    } catch (error) {
      console.error('Error saving profile:', error)
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSkill),
      })
      
      if (response.ok) {
        setEditingSkill(null)
        await fetchData()
      }
    } catch (error) {
      console.error('Error saving skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'profile', label: 'Profile' },
            { id: 'projects', label: 'Projects' },
            { id: 'skills', label: 'Skills & Technologies' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold">{projects.length}</p>
                  </div>
                  <FileText className="text-blue-500" size={24} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Featured Projects</p>
                    <p className="text-2xl font-bold">{projects.filter(p => p.featured).length}</p>
                  </div>
                  <Eye className="text-green-500" size={24} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Profile Status</p>
                    <p className="text-2xl font-bold">{profile ? '✓' : '✗'}</p>
                  </div>
                  <Users className="text-purple-500" size={24} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Skills</p>
                    <p className="text-2xl font-bold">{skills.length}</p>
                  </div>
                  <Code className="text-orange-500" size={24} />
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              {!editingProfile ? (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-800 rounded-lg">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-800 rounded-lg">{profile.title}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  {editingProfile ? (
                    <textarea
                      value={profile.description}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      rows={4}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-800 rounded-lg">{profile.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  {editingProfile ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-800 rounded-lg">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  {editingProfile ? (
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-800 rounded-lg">{profile.phone || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-800 rounded-lg">{profile.location || 'Not set'}</p>
                  )}
                </div>

                {/* Social Links Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Social Links</label>
                  {editingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">GitHub</label>
                        <input
                          type="url"
                          value={profile.socialLinks?.github || ''}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { 
                              ...profile.socialLinks, 
                              github: e.target.value 
                            } 
                          })}
                          placeholder="https://github.com/username"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                        <input
                          type="url"
                          value={profile.socialLinks?.linkedin || ''}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { 
                              ...profile.socialLinks, 
                              linkedin: e.target.value 
                            } 
                          })}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Twitter</label>
                        <input
                          type="url"
                          value={profile.socialLinks?.twitter || ''}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { 
                              ...profile.socialLinks, 
                              twitter: e.target.value 
                            } 
                          })}
                          placeholder="https://twitter.com/username"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Portfolio/Website</label>
                        <input
                          type="url"
                          value={profile.socialLinks?.website || ''}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { 
                              ...profile.socialLinks, 
                              website: e.target.value 
                            } 
                          })}
                          placeholder="https://yourwebsite.com"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Facebook</label>
                        <input
                          type="url"
                          value={profile.socialLinks?.facebook || ''}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { 
                              ...profile.socialLinks, 
                              facebook: e.target.value 
                            } 
                          })}
                          placeholder="https://facebook.com/username"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">YouTube</label>
                        <input
                          type="url"
                          value={profile.socialLinks?.youtube || ''}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { 
                              ...profile.socialLinks, 
                              youtube: e.target.value 
                            } 
                          })}
                          placeholder="https://youtube.com/@username"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-800 rounded-lg">
                      {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {profile.socialLinks.github && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">GitHub:</span>
                              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate">
                                {profile.socialLinks.github}
                              </a>
                            </div>
                          )}
                          {profile.socialLinks.linkedin && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">LinkedIn:</span>
                              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate">
                                {profile.socialLinks.linkedin}
                              </a>
                            </div>
                          )}
                          {profile.socialLinks.twitter && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">Twitter:</span>
                              <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate">
                                {profile.socialLinks.twitter}
                              </a>
                            </div>
                          )}
                          {profile.socialLinks.website && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">Website:</span>
                              <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate">
                                {profile.socialLinks.website}
                              </a>
                            </div>
                          )}
                          {profile.socialLinks.facebook && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">Facebook:</span>
                              <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate">
                                {profile.socialLinks.facebook}
                              </a>
                            </div>
                          )}
                          {profile.socialLinks.youtube && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">YouTube:</span>
                              <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate">
                                {profile.socialLinks.youtube}
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">No social links set</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Projects Management</h2>
              <button
                onClick={() => setEditingProject({
                  id: '',
                  title: '',
                  description: '',
                  technologies: [],
                  technologiesInput: '',
                  featured: false
                })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{project.title}</h3>
                      <p className="text-gray-400 mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-600 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-600 text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingProject({
                          ...project,
                          technologiesInput: project.technologies.join(', ')
                        })}
                        className="p-2 text-blue-400 hover:bg-gray-700 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-red-400 hover:bg-gray-700 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Code size={20} />
                <h2 className="text-xl font-semibold">Skills & Technologies</h2>
              </div>
              <button
                onClick={() => setEditingSkill({
                  name: '',
                  category: 'frontend',
                  proficiency: 50,
                  icon: '',
                  order: skills.length
                })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add Skill
              </button>
            </div>

            {/* Skills by Category */}
            <div className="space-y-6">
              {['frontend', 'backend', 'tools', 'languages'].map((category) => {
                const categorySkills = skills.filter(skill => skill.category === category)
                if (categorySkills.length === 0) return null
                
                return (
                  <div key={category} className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 capitalize flex items-center gap-2">
                      <Zap size={16} className="text-blue-400" />
                      {category}
                      <span className="text-sm text-gray-400">({categorySkills.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              {skill.icon && <span className="text-lg">{skill.icon}</span>}
                              <h4 className="font-medium">{skill.name}</h4>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingSkill(skill)}
                                className="p-1 text-blue-400 hover:bg-gray-600 rounded"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => deleteSkill(skill.id!)}
                                className="p-1 text-red-400 hover:bg-gray-600 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Proficiency</span>
                              <span className="text-blue-400">{skill.proficiency}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {skills.length === 0 && (
              <div className="text-center py-12">
                <Code size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 mb-4">No skills added yet</p>
                <button
                  onClick={() => setEditingSkill({
                    name: '',
                    category: 'frontend',
                    proficiency: 50,
                    icon: '',
                    order: 0
                  })}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Add Your First Skill
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Settings size={20} />
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Database Status</h3>
                <p className="text-green-400 text-sm">✓ Connected to MongoDB</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">API Status</h3>
                <p className="text-green-400 text-sm">✓ All endpoints active</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Project Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editingProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.technologiesInput || editingProject.technologies.join(', ')}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditingProject({ 
                      ...editingProject, 
                      technologiesInput: value,
                      technologies: value.split(',').map(t => t.trim()).filter(t => t.length > 0)
                    });
                  }}
                  placeholder="React, TypeScript, Next.js, Tailwind CSS"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate technologies with commas (e.g., React, TypeScript, Node.js)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={editingProject.githubUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Demo URL</label>
                <input
                  type="url"
                  value={editingProject.demoUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingProject.featured}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-400">Featured Project</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveProject(editingProject)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Skill Edit Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg border border-gray-800 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Code size={20} />
                {editingSkill.id ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setEditingSkill(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g., React, Node.js, Python"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="tools">Tools & Platforms</option>
                  <option value="languages">Programming Languages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Proficiency Level: {editingSkill.proficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingSkill.proficiency}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Icon (Emoji)</label>
                <input
                  type="text"
                  value={editingSkill.icon || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                  placeholder="⚛️ 🚀 💻 🔧"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Order</label>
                <input
                  type="number"
                  value={editingSkill.order}
                  onChange={(e) => setEditingSkill({ ...editingSkill, order: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingSkill(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSkill}
                disabled={loading || !editingSkill.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : 'Save Skill'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}