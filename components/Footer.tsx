'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Github, Linkedin, Twitter, Facebook, Youtube, ExternalLink, Heart, ArrowUp, Sparkles } from 'lucide-react'

interface Profile {
    name: string
    title: string
    email: string
    socialLinks?: {
        github?: string
        linkedin?: string
        twitter?: string
        website?: string
        facebook?: string
        youtube?: string
    }
}

interface Settings {
    siteName?: string
    footerText?: string
    copyrightText?: string
}

const Footer = () => {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [settings, setSettings] = useState<Settings>({})
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, settingsRes] = await Promise.all([
                    fetch('/api/profile'),
                    fetch('/api/settings')
                ])
                if (profileRes.ok) {
                    const profileData = await profileRes.json()
                    setProfile(profileData)
                }
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json()
                    setSettings(settingsData)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const getSocialIcon = (platform: string) => {
        switch (platform) {
            case 'github': return <Github size={18} />
            case 'linkedin': return <Linkedin size={18} />
            case 'twitter': return <Twitter size={18} />
            case 'facebook': return <Facebook size={18} />
            case 'youtube': return <Youtube size={18} />
            default: return <ExternalLink size={18} />
        }
    }

    const getSocialColor = (platform: string) => {
        switch (platform) {
            case 'github': return 'hover:bg-gray-700 hover:border-gray-500 hover:text-white'
            case 'linkedin': return 'hover:bg-blue-600/20 hover:border-blue-500 hover:text-blue-400'
            case 'twitter': return 'hover:bg-sky-500/20 hover:border-sky-400 hover:text-sky-400'
            case 'facebook': return 'hover:bg-blue-600/20 hover:border-blue-600 hover:text-blue-500'
            case 'youtube': return 'hover:bg-red-600/20 hover:border-red-500 hover:text-red-500'
            default: return 'hover:bg-purple-600/20 hover:border-purple-500 hover:text-purple-400'
        }
    }

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ]

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const currentYear = new Date().getFullYear()

    return (
        <>
            <footer className="relative border-t border-white/5 bg-gradient-to-b from-slate-950/50 to-slate-950">
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {/* Brand */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    {settings.siteName || profile?.name || 'Portfolio'}
                                </h3>
                            </div>
                            <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                                {settings.footerText || `${profile?.title || 'Full Stack Developer'}. Crafting digital experiences with modern technologies and creative solutions.`}
                            </p>
                            {/* Social Links */}
                            {profile?.socialLinks && (
                                <div className="flex gap-2">
                                    {Object.entries(profile.socialLinks).map(([platform, url]) => {
                                        if (!url) return null
                                        return (
                                            <motion.a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                className={`p-2.5 rounded-xl border transition-all duration-300 bg-white/5 border-white/10 text-gray-500 ${getSocialColor(platform)}`}
                                                aria-label={platform}
                                            >
                                                {getSocialIcon(platform)}
                                            </motion.a>
                                        )
                                    })}
                                </div>
                            )}
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Navigation</h4>
                            <nav className="grid grid-cols-2 gap-3" aria-label="Footer navigation">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={() => scrollToSection(link.href)}
                                        className="text-gray-500 hover:text-white transition-colors text-left text-sm group flex items-center gap-1"
                                    >
                                        <span className="w-0 h-px bg-blue-500 group-hover:w-2 transition-all duration-300" />
                                        {link.name}
                                    </button>
                                ))}
                            </nav>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Get In Touch</h4>
                            {profile?.email && (
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="text-gray-500 hover:text-blue-400 transition-colors text-sm block mb-5"
                                >
                                    {profile.email}
                                </a>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => scrollToSection('#contact')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-300"
                            >
                                Start a Conversation
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm flex items-center gap-1.5 text-gray-600">
                            © {currentYear} {settings.siteName || profile?.name || 'Portfolio'}. 
                            <span className="inline-flex items-center gap-1">
                                Built with <Heart size={12} className="text-red-500 animate-pulse" /> using Next.js
                            </span>
                        </p>
                        <p className="text-xs text-gray-700">
                            {settings.copyrightText || 'All rights reserved.'}
                        </p>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 group"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    )
}

export default Footer
