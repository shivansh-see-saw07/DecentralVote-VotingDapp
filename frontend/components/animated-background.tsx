"use client"
import * as React from "react"
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

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {/* Primary floating orb */}
            <div
                className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000 ease-out bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-700 dark:to-pink-700"
                style={{
                    transform: `translate(${mousePosition.x * 0.5 - 50}px, ${mousePosition.y * 0.3 - 50 + scrollY * 0.1}px) rotate(${scrollY * 0.1}deg)`,
                }}
            />

            {/* Secondary floating orb */}
            <div
                className="absolute w-64 h-64 rounded-full opacity-15 blur-2xl transition-all duration-700 ease-out bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 dark:from-green-600 dark:via-blue-700 dark:to-purple-800"
                style={{
                    transform: `translate(${100 - mousePosition.x * 0.3}px, ${100 - mousePosition.y * 0.2 + scrollY * 0.05}px) rotate(${-scrollY * 0.05}deg)`,
                    right: "10%",
                    top: "20%",
                }}
            />

            {/* Tertiary floating orb */}
            <div
                className="absolute w-48 h-48 rounded-full opacity-10 blur-xl transition-all duration-500 ease-out bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 dark:from-yellow-600 dark:via-orange-700 dark:to-red-700"
                style={{
                    transform: `translate(${mousePosition.x * 0.2 - 25}px, ${mousePosition.y * 0.4 - 25 + scrollY * 0.15}px) rotate(${scrollY * 0.2}deg)`,
                    left: "70%",
                    bottom: "30%",
                }}
            />

            {/* Animated geometric shapes */}
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

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/10 rounded-full opacity-30 transition-all duration-1000 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x * (0.05 + i * 0.02)}px, ${mousePosition.y * (0.03 + i * 0.01) + scrollY * (0.02 + i * 0.01)}px)`,
                        left: `${20 + i * 15}%`,
                        top: `${10 + i * 12}%`,
                        animationDelay: `${i * 200}ms`,
                    }}
                />
            ))}

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] transition-all duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + scrollY * 0.01}px)`,
                    backgroundImage: `
            linear-gradient(rgba(var(--foreground), 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--foreground), 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                }}
            />
        </div>
    )
}
