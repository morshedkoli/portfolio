'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

interface Profile {
    name: string
}

interface Settings {
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const currentYear = new Date().getFullYear()

    return (
        <>
            <footer className="relative border-t border-white/5 bg-gradient-to-b from-slate-950/50 to-slate-950">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-sm text-gray-600 text-center">
                        {settings.copyrightText || `© ${currentYear} ${profile?.name || 'Portfolio'}. All rights reserved.`}
                    </p>
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
