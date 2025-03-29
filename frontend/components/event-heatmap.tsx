"use client"

import { useEffect, useRef } from "react"

interface EventHeatmapProps {
  eventType: string
  timeFrame: string
}

export default function EventHeatmap({ eventType, timeFrame }: EventHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Draw world map (simplified)
    ctx.fillStyle = "#f1f5f9" // Light background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw simplified continents
    ctx.fillStyle = "#e2e8f0"

    // North America
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.1, canvas.height * 0.2)
    ctx.lineTo(canvas.width * 0.3, canvas.height * 0.2)
    ctx.lineTo(canvas.width * 0.3, canvas.height * 0.5)
    ctx.lineTo(canvas.width * 0.1, canvas.height * 0.5)
    ctx.closePath()
    ctx.fill()

    // South America
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.2, canvas.height * 0.5)
    ctx.lineTo(canvas.width * 0.3, canvas.height * 0.5)
    ctx.lineTo(canvas.width * 0.25, canvas.height * 0.8)
    ctx.lineTo(canvas.width * 0.15, canvas.height * 0.8)
    ctx.closePath()
    ctx.fill()

    // Europe
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.4, canvas.height * 0.2)
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.2)
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.4)
    ctx.lineTo(canvas.width * 0.4, canvas.height * 0.4)
    ctx.closePath()
    ctx.fill()

    // Africa
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.4, canvas.height * 0.4)
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.4)
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.7)
    ctx.lineTo(canvas.width * 0.4, canvas.height * 0.7)
    ctx.closePath()
    ctx.fill()

    // Asia
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.5, canvas.height * 0.2)
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.2)
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.6)
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.6)
    ctx.closePath()
    ctx.fill()

    // Australia
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.7, canvas.height * 0.6)
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.6)
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.7)
    ctx.lineTo(canvas.width * 0.7, canvas.height * 0.7)
    ctx.closePath()
    ctx.fill()

    // Generate heatmap data based on props
    const heatmapPoints = [
      // Format: [x, y, intensity]
      // North America
      [canvas.width * 0.2, canvas.height * 0.3, 0.8], // New York
      [canvas.width * 0.15, canvas.height * 0.35, 0.7], // Los Angeles
      [canvas.width * 0.18, canvas.height * 0.25, 0.5], // Chicago

      // Europe
      [canvas.width * 0.43, canvas.height * 0.25, 0.9], // London
      [canvas.width * 0.45, canvas.height * 0.28, 0.8], // Paris
      [canvas.width * 0.47, canvas.height * 0.3, 0.6], // Berlin

      // Asia
      [canvas.width * 0.7, canvas.height * 0.3, 0.7], // Tokyo
      [canvas.width * 0.65, canvas.height * 0.4, 0.6], // Shanghai
      [canvas.width * 0.6, canvas.height * 0.35, 0.5], // Mumbai

      // Australia
      [canvas.width * 0.75, canvas.height * 0.65, 0.5], // Sydney

      // South America
      [canvas.width * 0.25, canvas.height * 0.6, 0.6], // São Paulo

      // Africa
      [canvas.width * 0.45, canvas.height * 0.5, 0.4], // Cairo
    ]

    // Adjust heatmap based on event type
    let adjustedPoints = [...heatmapPoints]
    if (eventType === "music") {
      // Boost music events in certain cities
      adjustedPoints = adjustedPoints.map((point) => {
        // Boost New York, Los Angeles, London, Berlin
        if (
          (point[0] === canvas.width * 0.2 && point[1] === canvas.height * 0.3) ||
          (point[0] === canvas.width * 0.15 && point[1] === canvas.height * 0.35) ||
          (point[0] === canvas.width * 0.43 && point[1] === canvas.height * 0.25) ||
          (point[0] === canvas.width * 0.47 && point[1] === canvas.height * 0.3)
        ) {
          return [point[0], point[1], Math.min(1, point[2] * 1.3)]
        }
        return point
      })
    } else if (eventType === "sports") {
      // Boost sports events in certain cities
      adjustedPoints = adjustedPoints.map((point) => {
        // Boost London, Tokyo, São Paulo
        if (
          (point[0] === canvas.width * 0.43 && point[1] === canvas.height * 0.25) ||
          (point[0] === canvas.width * 0.7 && point[1] === canvas.height * 0.3) ||
          (point[0] === canvas.width * 0.25 && point[1] === canvas.height * 0.6)
        ) {
          return [point[0], point[1], Math.min(1, point[2] * 1.3)]
        }
        return point
      })
    }

    // Draw heatmap points
    adjustedPoints.forEach(([x, y, intensity]) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.1)
      gradient.addColorStop(0, `rgba(239, 68, 68, ${intensity})`) // Red with intensity
      gradient.addColorStop(1, "rgba(239, 68, 68, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, canvas.width * 0.1, 0, Math.PI * 2)
      ctx.fill()
    })

    // Add city labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "12px sans-serif"
    ctx.fillText("New York", canvas.width * 0.2, canvas.height * 0.3 - 10)
    ctx.fillText("London", canvas.width * 0.43, canvas.height * 0.25 - 10)
    ctx.fillText("Tokyo", canvas.width * 0.7, canvas.height * 0.3 - 10)
    ctx.fillText("Sydney", canvas.width * 0.75, canvas.height * 0.65 - 10)
    ctx.fillText("São Paulo", canvas.width * 0.25, canvas.height * 0.6 - 10)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [eventType, timeFrame])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ minHeight: "400px" }} />
}

