'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { GraduationCap, Calendar, Award } from 'lucide-react'

interface Education {
    id: string
    institution: string
    degree: string
    field?: string
    description?: string
    startDate: string
    endDate?: string
    current: boolean
    gpa?: string
}

const Education = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [educations, setEducations] = useState<Education[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await fetch('/api/education')
                if (response.ok) {
                    const data = await response.json()
                    setEducations(data)
                }
            } catch (error) {
                console.error('Error fetching education:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEducation()
    }, [])

    if (!loading && educations.length === 0) return null

    return (
        <section id="education" className="py-16 md:py-24 px-4 sm:px-6 relative">
            <div className="max-w-6xl mx-auto" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 glow-text">
                        Education
                    </h2>
                    <div className="h-1 w-16 md:w-20 bg-purple-500 mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center text-zinc-500">Loading education...</div>
                    ) : (
                        educations.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:border-purple-500/30 transition-all hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                        <GraduationCap size={32} />
                                    </div>
                                    <span className="text-zinc-500 font-mono text-sm flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                                        <Calendar size={14} />
                                        {new Date(edu.startDate).getFullYear()} - {edu.current ? 'Present' : new Date(edu.endDate!).getFullYear()}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                                <h4 className="text-xl text-purple-400 mb-4">{edu.institution}</h4>

                                {edu.field && (
                                    <p className="text-zinc-400 mb-4 text-lg">
                                        Major in <span className="text-zinc-200">{edu.field}</span>
                                    </p>
                                )}

                                {(edu.description || edu.gpa) && (
                                    <div className="pt-6 border-t border-zinc-800 space-y-4">
                                        {edu.gpa && (
                                            <div className="flex items-center gap-2 text-yellow-500 font-medium">
                                                <Award size={18} />
                                                <span>GPA: {edu.gpa}</span>
                                            </div>
                                        )}
                                        {edu.description && (
                                            <p className="text-zinc-400 leading-relaxed">{edu.description}</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default Education
