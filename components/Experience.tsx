'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react'

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
        <section id="experience" className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto relative" ref={ref}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-14 md:mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
                    >
                        <Briefcase size={14} className="text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">Career Path</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                            Experience
                        </span>
                    </h2>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Timeline line */}
                    <motion.div 
                        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
                        initial={{ height: 0 }}
                        animate={isInView ? { height: '100%' } : { height: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    >
                        <div className="w-full h-full bg-gradient-to-b from-blue-500/40 via-purple-500/20 to-transparent" />
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-12 md:space-y-16">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                                    transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                                    className={`relative flex flex-col md:flex-row gap-6 md:gap-10 ${
                                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={isInView ? { scale: 1 } : { scale: 0 }}
                                            transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 300 }}
                                            className="relative"
                                        >
                                            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-500 animate-ping opacity-30" />
                                        </motion.div>
                                    </div>

                                    {/* Date column */}
                                    <div className={`hidden md:flex md:w-[calc(50%-2rem)] ${
                                        index % 2 === 0 ? 'justify-end text-right' : 'justify-start text-left'
                                    }`}>
                                        <div className="pt-0">
                                            <p className="text-blue-400 font-mono font-medium flex items-center gap-2">
                                                {index % 2 !== 0 && <Calendar size={14} />}
                                                {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : new Date(exp.endDate!).getFullYear()}
                                                {index % 2 === 0 && <Calendar size={14} />}
                                            </p>
                                            {exp.location && (
                                                <p className="text-gray-500 text-sm mt-1.5 flex items-center gap-1.5">
                                                    {index % 2 !== 0 && <MapPin size={12} />}
                                                    {exp.location}
                                                    {index % 2 === 0 && <MapPin size={12} />}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content card */}
                                    <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)]">
                                        <div className="glass-card rounded-2xl p-6 group hover:shadow-2xl hover:shadow-blue-500/[0.06] transition-all duration-500">
                                            {/* Mobile date */}
                                            <div className="md:hidden flex flex-wrap gap-3 text-sm mb-3">
                                                <span className="flex items-center gap-1.5 text-blue-400 font-mono">
                                                    <Calendar size={12} />
                                                    {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : new Date(exp.endDate!).getFullYear()}
                                                </span>
                                                {exp.location && (
                                                    <span className="flex items-center gap-1 text-gray-500">
                                                        <MapPin size={12} /> {exp.location}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                                                {exp.position}
                                            </h3>
                                            <h4 className="text-base text-gray-400 flex items-center gap-2 mb-4">
                                                <Briefcase size={14} className="text-blue-500" />
                                                {exp.company}
                                            </h4>
                                            <p className="text-gray-400/80 leading-relaxed text-sm whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Experience
