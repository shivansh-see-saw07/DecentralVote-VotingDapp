"use client"

import { useEffect, useState } from "react"

export function AnimatedBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            })
        }

        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    // Track viewport size to avoid NaN in SSR/first render
    const [viewport, setViewport] = useState({ width: 0, height: 0 })
    useEffect(() => {
        setViewport({ width: window.innerWidth, height: window.innerHeight })
        const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Grid settings
    const gridSpacing = 50
    const gridRows = Math.ceil(viewport.height / gridSpacing) + 2
    const gridCols = Math.ceil(viewport.width / gridSpacing) + 2
    const dotBaseSize = 4
    const dotActiveSize = 8
    const dotMoveRadius = 40

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Animated geometric shapes (unchanged) */}
            <div
                className="absolute w-32 h-32 opacity-5 transition-all duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1 + scrollY * 0.08}px) rotate(${scrollY * 0.3}deg)`,
                    left: "20%",
                    top: "60%",
                }}
            >
                <div className="w-full h-full border-2 border-primary/20 rotate-45 rounded-lg" />
            </div>
            <div
                className="absolute w-24 h-24 opacity-5 transition-all duration-800 ease-out"
                style={{
                    transform: `translate(${-mousePosition.x * 0.15}px, ${-mousePosition.y * 0.1 + scrollY * 0.12}px) rotate(${-scrollY * 0.2}deg)`,
                    right: "30%",
                    top: "70%",
                }}
            >
                <div className="w-full h-full border-2 border-secondary/20 rounded-full" />
            </div>
            {/* Grid pattern overlay - remains */}
            <div
                className="absolute inset-0 opacity-40 transition-all duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + scrollY * 0.01}px)`,
                    backgroundImage: `
            linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)
          `,
                    backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
                }}
            />
            {/* Debug: Single large green dot at top left of screen */}
            {viewport.width > 0 && viewport.height > 0 && (
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1000, pointerEvents: 'none' }}>
                    <circle
                        cx={40}
                        cy={40}
                        r={40}
                        fill="#00ff00"
                        opacity="1"
                    />
                </svg>
            )}
            {/* Add a style tag to set --dot-color based on theme */}
            <style>{`
                html.light { --dot-color: rgba(34,34,34,0.4); }
                html.dark { --dot-color: rgba(255,255,255,0.4); }
            `}</style>
        </div>
    )
}
