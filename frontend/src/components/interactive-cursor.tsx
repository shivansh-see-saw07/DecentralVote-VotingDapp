"use client"

import { useEffect, useState } from "react"

export function InteractiveCursor() {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPosition({ x: e.clientX, y: e.clientY })
        }

        const handleMouseEnter = () => setIsHovering(true)
        const handleMouseLeave = () => setIsHovering(false)

        // Add event listeners to interactive elements
        const interactiveElements = document.querySelectorAll("button, a, [role='button']")

        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", handleMouseEnter)
            el.addEventListener("mouseleave", handleMouseLeave)
        })

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnter)
                el.removeEventListener("mouseleave", handleMouseLeave)
            })
        }
    }, [])

    return (
        <div className="hidden md:block fixed inset-0 pointer-events-none z-50">
            {/* Main cursor follower */}
            <div
                className={`absolute w-6 h-6 rounded-full border-2 border-primary/30 transition-all duration-100 ease-out ${isHovering ? "scale-150 border-primary/60" : "scale-100"
                    }`}
                style={{
                    transform: `translate(${cursorPosition.x - 12}px, ${cursorPosition.y - 12}px)`,
                }}
            />

            {/* Trailing cursor effect */}
            <div
                className="absolute w-2 h-2 bg-primary/20 rounded-full transition-all duration-300 ease-out"
                style={{
                    transform: `translate(${cursorPosition.x - 4}px, ${cursorPosition.y - 4}px)`,
                }}
            />
        </div>
    )
}
