'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react'

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
        <section id="education" className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto relative" ref={ref}>
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
                    >
                        <BookOpen size={14} className="text-purple-400" />
                        <span className="text-purple-400 text-sm font-medium">Academic Background</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                            Education
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                        </div>
                    ) : (
                        educations.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
                                transition={{ duration: 0.5, delay: index * 0.12 }}
                                className="glass-card rounded-2xl p-7 group hover:shadow-2xl hover:shadow-purple-500/[0.06] transition-all duration-500"
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                        <GraduationCap size={28} />
                                    </div>
                                    <span className="text-gray-500 font-mono text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                                        <Calendar size={12} />
                                        {new Date(edu.startDate).getFullYear()} — {edu.current ? 'Present' : new Date(edu.endDate!).getFullYear()}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">{edu.degree}</h3>
                                <h4 className="text-base text-purple-400/80 mb-4">{edu.institution}</h4>

                                {edu.field && (
                                    <p className="text-gray-400/80 mb-4 text-sm">
                                        Major in <span className="text-gray-300">{edu.field}</span>
                                    </p>
                                )}

                                {(edu.description || edu.gpa) && (
                                    <div className="pt-4 border-t border-white/[0.04] space-y-3">
                                        {edu.gpa && (
                                            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                                                <Award size={16} />
                                                <span>GPA: {edu.gpa}</span>
                                            </div>
                                        )}
                                        {edu.description && (
                                            <p className="text-gray-400/80 leading-relaxed text-sm">{edu.description}</p>
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
