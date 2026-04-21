'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react'

interface Certification {
    id: string
    name: string
    issuer: string
    date: string
    url?: string
    description?: string
}

const Certifications = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [certifications, setCertifications] = useState<Certification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await fetch('/api/certifications')
                if (response.ok) {
                    const data = await response.json()
                    setCertifications(data)
                }
            } catch (error) {
                console.error('Error fetching certifications:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCertifications()
    }, [])

    if (!loading && certifications.length === 0) return null

    return (
        <section id="certifications" className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-amber-600/[0.03] rounded-full blur-[120px]" />
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
                    >
                        <ShieldCheck size={14} className="text-amber-400" />
                        <span className="text-amber-400 text-sm font-medium">Credentials</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                            Certifications
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                        </div>
                    ) : (
                        certifications.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
                                transition={{ duration: 0.5, delay: index * 0.12 }}
                                className="glass-card rounded-2xl p-7 group hover:shadow-2xl hover:shadow-amber-500/[0.06] transition-all duration-500"
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                                        <Award size={28} />
                                    </div>
                                    <span className="text-gray-500 font-mono text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                                        <Calendar size={12} />
                                        {new Date(cert.date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'short' 
                                        })}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">{cert.name}</h3>
                                <h4 className="text-base text-amber-400/80 mb-4">{cert.issuer}</h4>

                                {cert.description && (
                                    <p className="text-gray-400/80 leading-relaxed text-sm mb-4">
                                        {cert.description}
                                    </p>
                                )}

                                {cert.url && (
                                    <div className="pt-4 border-t border-white/[0.04]">
                                        <a
                                            href={cert.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium group/link"
                                        >
                                            <ExternalLink size={14} />
                                            View Credential
                                            <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                                        </a>
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

export default Certifications
