

import { useEffect, useRef } from "react"

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    interface Star {
      x: number
      y: number
      radius: number
      color: string
      velocity: number
      opacity: number
      twinkleSpeed: number
      twinklePhase: number
    }
    const stars: Star[] = []
    const starCount = Math.floor((canvas.width * canvas.height) / 3000) 
    const createStar = (atBottom = false): Star => {
      const radius = Math.random() * 1.5 + 0.5
      const y = atBottom ? canvas.height + radius : Math.random() * canvas.height
      const hue = Math.random() * 60 + 180 
      const saturation = Math.random() * 80 
      const lightness = 90 + Math.random() * 10 

      return {
        x: Math.random() * canvas.width,
        y,
        radius,
        color: `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`,
        velocity: (Math.random() * 0.5 + 0.1) * (radius / 1.5), 
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.01 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }
    }
    for (let i = 0; i < starCount; i++) {
      stars.push(createStar())
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        star.y -= star.velocity
        star.twinklePhase += star.twinkleSpeed
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7
        ctx.save()
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 4)
        gradient.addColorStop(0, star.color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.globalAlpha = star.opacity * twinkle * 0.5
        ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.fillStyle = star.color
        ctx.globalAlpha = star.opacity * twinkle
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
        if (star.radius > 1) {
          ctx.beginPath()
          ctx.strokeStyle = star.color
          ctx.globalAlpha = star.opacity * twinkle * 0.5
          ctx.lineWidth = star.radius / 4
          ctx.moveTo(star.x - star.radius * 2, star.y)
          ctx.lineTo(star.x + star.radius * 2, star.y)
          ctx.moveTo(star.x, star.y - star.radius * 2)
          ctx.lineTo(star.x, star.y + star.radius * 2)
          ctx.stroke()
        }
        ctx.restore()
        if (star.y < -star.radius * 5) {
          stars[i] = createStar(true)
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: "radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)" }}
    />
  )
}

