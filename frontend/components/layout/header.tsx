"use client"


import { Vote } from "lucide-react"
import { Link } from "react-router-dom"
import { WalletConnectButton } from "../wallet-connect-button"
import { ThemeToggle } from "../theme-toggle"
import { MobileNav } from "../mobile-nav"

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <MobileNav />
                    <Link to="/" className="flex items-center space-x-2">
                        <Vote className="h-6 w-6 transition-transform hover:scale-110" />
                        <span className="font-bold text-xl hidden sm:block">DecentralVote</span>
                        <span className="font-bold text-lg sm:hidden">DV</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link
                        to="/elections"
                        className="text-sm font-medium hover:text-primary transition-colors duration-200 hover:scale-105 transform"
                    >
                        Elections
                    </Link>
                    <Link
                        to="/admin"
                        className="text-sm font-medium hover:text-primary transition-colors duration-200 hover:scale-105 transform"
                    >
                        Admin
                    </Link>
                </nav>

                <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <WalletConnectButton />
                </div>
            </div>
        </header>
    )
}
