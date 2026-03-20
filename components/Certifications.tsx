'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Award, Calendar, ExternalLink } from 'lucide-react'

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
        <section id="certifications" className="py-16 md:py-24 px-4 sm:px-6 relative bg-black/30">
            <div className="max-w-6xl mx-auto" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 glow-text">
                        Certifications
                    </h2>
                    <div className="h-1 w-16 md:w-20 bg-yellow-500 mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center text-zinc-500">Loading certifications...</div>
                    ) : (
                        certifications.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:border-yellow-500/30 transition-all hover:-translate-y-1 group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                                        <Award size={32} />
                                    </div>
                                    <span className="text-zinc-500 font-mono text-sm flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                                        <Calendar size={14} />
                                        {new Date(cert.date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'short' 
                                        })}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{cert.name}</h3>
                                <h4 className="text-xl text-yellow-400 mb-4">{cert.issuer}</h4>

                                {cert.description && (
                                    <p className="text-zinc-400 leading-relaxed mb-4">
                                        {cert.description}
                                    </p>
                                )}

                                {cert.url && (
                                    <div className="pt-4 border-t border-zinc-800">
                                        <a
                                            href={cert.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                                        >
                                            <ExternalLink size={16} />
                                            View Credential
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
