'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

interface Experience {
    id: string
    company: string
    position: string
    description: string
    startDate: string
    endDate?: string
    current: boolean
    location?: string
}

const Experience = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await fetch('/api/experience')
                if (response.ok) {
                    const data = await response.json()
                    setExperiences(data)
                }
            } catch (error) {
                console.error('Error fetching experiences:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchExperiences()
    }, [])

    if (!loading && experiences.length === 0) return null

    return (
        <section id="experience" className="py-24 px-4 relative bg-black/50">
            <div className="max-w-6xl mx-auto" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 glow-text">
                        Experience
                    </h2>
                    <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
                </motion.div>

                <div className="relative border-l-2 border-zinc-800 ml-4 md:ml-0 md:pl-0 space-y-12">
                    {loading ? (
                        <div className="text-center text-zinc-500">Loading experience...</div>
                    ) : (
                        experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative pl-8 md:pl-0"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-black box-content" />

                                <div className="md:grid md:grid-cols-12 md:gap-8 group">
                                    {/* Date (Desktop) */}
                                    <div className="hidden md:block md:col-span-3 text-right pt-1">
                                        <p className="text-blue-400 font-mono font-medium flex items-center justify-end gap-2">
                                            {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate!).getFullYear()}
                                            <Calendar size={16} />
                                        </p>
                                        {exp.location && (
                                            <p className="text-zinc-500 text-sm mt-1 flex items-center justify-end gap-1">
                                                {exp.location} <MapPin size={14} />
                                            </p>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="md:col-span-9 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:border-blue-500/30 transition-colors">
                                        <div className="mb-4">
                                            {/* Mobile Date */}
                                            <div className="md:hidden flex flex-wrap gap-4 text-sm text-blue-400 mb-2 font-mono">
                                                <span className="flex items-center gap-1"><Calendar size={14} />{new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate!).getFullYear()}</span>
                                                {exp.location && <span className="flex items-center gap-1"><MapPin size={14} /> {exp.location}</span>}
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{exp.position}</h3>
                                            <h4 className="text-xl text-zinc-400 flex items-center gap-2">
                                                <Briefcase size={18} className="text-blue-500" />
                                                {exp.company}
                                            </h4>
                                        </div>
                                        <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default Experience
