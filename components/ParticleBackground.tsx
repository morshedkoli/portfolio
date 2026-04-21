'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Pure canvas-based 3D-inspired particle system — no Three.js dependency issues
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    let orbs: Orb[] = []
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Floating particle with depth
    class Particle {
      x: number
      y: number
      z: number // depth 0-1
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
      pulseSpeed: number
      pulsePhase: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.z = Math.random()
        this.size = (Math.random() * 2 + 0.3) * (1 - this.z * 0.5)
        this.speedX = (Math.random() - 0.5) * 0.3 * (1 - this.z * 0.5)
        this.speedY = (Math.random() - 0.5) * 0.3 * (1 - this.z * 0.5)
        this.opacity = (Math.random() * 0.6 + 0.2) * (1 - this.z * 0.4)
        this.pulseSpeed = Math.random() * 0.02 + 0.005
        this.pulsePhase = Math.random() * Math.PI * 2
        const colors = [
          '59, 130, 246',  // blue
          '139, 92, 246',  // purple
          '6, 182, 212',   // cyan
          '168, 85, 247',  // violet
          '99, 102, 241',  // indigo
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(time: number) {
        this.x += this.speedX
        this.y += this.speedY

        // Mouse repulsion with depth-based strength
        const dx = mouseRef.current.x - this.x
        const dy = mouseRef.current.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const repulsionRadius = 120 * (1 - this.z * 0.6)
        if (distance < repulsionRadius) {
          const force = (repulsionRadius - distance) / repulsionRadius
          this.x -= dx * force * 0.015
          this.y -= dy * force * 0.015
        }

        // Wrap
        if (this.x < -10) this.x = canvas!.width + 10
        if (this.x > canvas!.width + 10) this.x = -10
        if (this.y < -10) this.y = canvas!.height + 10
        if (this.y > canvas!.height + 10) this.y = -10

        // Pulse opacity
        this.opacity = (Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.15 + 0.35) * (1 - this.z * 0.4)
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Glow effect for brighter particles
        if (this.size > 1.2) {
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4)
          gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity * 0.3})`)
          gradient.addColorStop(1, `rgba(${this.color}, 0)`)
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
        ctx.fill()
      }
    }

    // Floating geometric orb (simulates 3D)
    class Orb {
      x: number
      y: number
      radius: number
      color: string
      speed: number
      angle: number
      wobbleSpeed: number
      wobbleAmount: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.radius = Math.random() * 120 + 60
        this.speed = Math.random() * 0.0003 + 0.0001
        this.angle = Math.random() * Math.PI * 2
        this.wobbleSpeed = Math.random() * 0.001 + 0.0005
        this.wobbleAmount = Math.random() * 40 + 20
        this.opacity = Math.random() * 0.04 + 0.02
        const colors = [
          '59, 130, 246',  // blue
          '139, 92, 246',  // purple
          '6, 182, 212',   // cyan
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(time: number) {
        this.x += Math.cos(this.angle) * 0.15
        this.y += Math.sin(this.angle) * 0.1
        this.angle += this.speed
        
        // Gentle floating
        const offsetY = Math.sin(time * this.wobbleSpeed) * this.wobbleAmount
        
        // Keep in bounds
        if (this.x < -this.radius) this.x = canvas!.width + this.radius
        if (this.x > canvas!.width + this.radius) this.x = -this.radius
        if (this.y < -this.radius) this.y = canvas!.height + this.radius
        if (this.y > canvas!.height + this.radius) this.y = -this.radius

        return offsetY
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        const offsetY = this.update(time)
        
        // Radial gradient orb
        const gradient = ctx.createRadialGradient(
          this.x, this.y + offsetY, 0,
          this.x, this.y + offsetY, this.radius
        )
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity * 1.5})`)
        gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(${this.color}, 0)`)

        ctx.beginPath()
        ctx.arc(this.x, this.y + offsetY, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      orbs = []
      
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000))
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
      
      // 4-6 floating orbs
      const orbCount = Math.min(6, Math.max(3, Math.floor(canvas.width / 300)))
      for (let i = 0; i < orbCount; i++) {
        orbs.push(new Orb())
      }
    }

    const connectParticles = () => {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 100

          if (distance < maxDist) {
            const opacity = 0.08 * (1 - distance / maxDist)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      if (!ctx) return
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw orbs first (behind particles)
      orbs.forEach(orb => orb.draw(ctx, time))

      // Draw particles
      particles.forEach(particle => {
        particle.update(time)
        particle.draw(ctx)
      })

      connectParticles()
      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Deep cosmic gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#0a0a2e] to-[#0f0728]" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Canvas for particles + orbs */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.9 }}
      />

      {/* Large ambient glow orbs (CSS-based for smooth performance) */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-blue-600/[0.05] blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/[0.05] blur-[150px] animate-pulse-slow" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-cyan-600/[0.03] blur-[120px] animate-pulse-slow" style={{ animationDelay: '-5s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-600/[0.04] blur-[100px] animate-pulse-slow" style={{ animationDelay: '-7s' }} />

      {/* Gradient depth overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-transparent to-[#030014]/50" />
    </div>
  )
}

export default ParticleBackground
