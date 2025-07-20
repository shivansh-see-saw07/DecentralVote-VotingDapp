import * as React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "../components/providers"
import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "../src/components/ui/toaster"
import { AnimatedBackground } from "../components/animated-background"
import { InteractiveCursor } from "../components/interactive-cursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "DecentralVote - Decentralized Voting Platform",
    description: "A secure, transparent voting platform built on Ethereum",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <AnimatedBackground />
                    <InteractiveCursor />
                    <Providers>
                        {children}
                        <Toaster />
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    )
}
