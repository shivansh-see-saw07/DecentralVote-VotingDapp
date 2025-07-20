"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "../src/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../src/components/ui/sheet"
import { cn } from "../src/lib/utils"
import { sidebarNavItems } from "./layout/sidebar"
import { Link } from "react-router-dom"

export function MobileNav() {
    const [open, setOpen] = React.useState(false)
    const pathname = usePathname()

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center border-b px-6">
                        <Link to="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                            <span className="font-bold text-xl">DecentralVote</span>
                        </Link>
                    </div>
                    <nav className="flex-1 space-y-2 p-4">
                        {sidebarNavItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.href && "bg-accent text-accent-foreground",
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    )
}
