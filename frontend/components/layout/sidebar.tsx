"use client"
import * as React from "react"
import { cn } from "../../src/lib/utils"
import { Vote, Plus, Users, BarChart3, Settings, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

export const sidebarNavItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Elections",
        href: "/elections",
        icon: Vote,
    },
    {
        title: "Create Election",
        href: "/elections/create",
        icon: Plus,
    },
    {
        title: "Admin",
        href: "/admin",
        icon: Settings,
    },
]

export function Sidebar() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="hidden md:block pb-12 w-64 border-r bg-background/50">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <nav className="grid items-start px-2 text-sm font-medium">
                            {sidebarNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-primary hover:bg-accent hover:scale-105 transform",
                                        pathname === item.href && "bg-accent text-primary shadow-sm",
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}
