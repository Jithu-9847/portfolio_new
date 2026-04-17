"use client"

import { useEffect, useRef } from "react"

interface Dot {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
}

export function FloatingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const dotsRef = useRef<Dot[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initDots()
    }

    const initDots = () => {
      const dots: Dot[] = []
      const spacing = 80
      const cols = Math.ceil(canvas.width / spacing) + 1
      const rows = Math.ceil(canvas.height / spacing) + 1

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing
          const y = j * spacing
          dots.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
          })
        }
      }
      dotsRef.current = dots
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current
      const interactionRadius = 150
      const pushStrength = 30

      dotsRef.current.forEach((dot) => {
        // Calculate distance from mouse
        const dx = mouse.x - dot.x
        const dy = mouse.y - dot.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < interactionRadius && dist > 0) {
          // Push dots away from mouse
          const force = (interactionRadius - dist) / interactionRadius
          const angle = Math.atan2(dy, dx)
          dot.vx -= Math.cos(angle) * force * pushStrength * 0.1
          dot.vy -= Math.sin(angle) * force * pushStrength * 0.1
        }

        // Spring back to original position
        const springForce = 0.05
        dot.vx += (dot.baseX - dot.x) * springForce
        dot.vy += (dot.baseY - dot.y) * springForce

        // Apply friction
        dot.vx *= 0.9
        dot.vy *= 0.9

        // Update position
        dot.x += dot.vx
        dot.y += dot.vy

        // Draw dot
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(139, 92, 246, 0.25)"
        ctx.fill()
      })

      // Draw connections between nearby dots
      ctx.strokeStyle = "rgba(139, 92, 246, 0.08)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < dotsRef.current.length; i++) {
        for (let j = i + 1; j < dotsRef.current.length; j++) {
          const dot1 = dotsRef.current[i]
          const dot2 = dotsRef.current[j]
          const dx = dot1.x - dot2.x
          const dy = dot1.y - dot2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(dot1.x, dot1.y)
            ctx.lineTo(dot2.x, dot2.y)
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  )
}
