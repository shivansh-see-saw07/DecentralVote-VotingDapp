"use client"
import * as React from "react"
import { Header } from "../components/layout/header"
import { Sidebar } from "../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"
import { Badge } from "../src/components/ui/badge"
import { Vote, Users, Trophy, Clock } from "lucide-react"
import { useAccount } from "wagmi"

export default function Dashboard() {
    const { isConnected } = useAccount()

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background relative">
                <Header />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
                    <Card className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-4 duration-500 backdrop-blur-sm bg-background/80 border-border/50">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                                <Vote className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Welcome to DecentralVote</CardTitle>
                            <CardDescription>Connect your wallet to start participating in decentralized voting</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground">Overview of your voting activities and platform statistics</p>
                        </div>

                        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                            {[
                                { title: "Active Elections", value: "12", change: "+2 from last week", icon: Vote },
                                { title: "Total Candidates", value: "48", change: "Across all elections", icon: Users },
                                { title: "Your Votes Cast", value: "7", change: "In active elections", icon: Trophy },
                                { title: "Elections Created", value: "3", change: "By you", icon: Clock },
                            ].map((stat, index) => (
                                <Card
                                    key={stat.title}
                                    className="transition-all duration-200 hover:shadow-lg hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xs md:text-sm font-medium">{stat.title}</CardTitle>
                                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-in fade-in-50 slide-in-from-left-4 duration-700 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90">
                                <CardHeader>
                                    <CardTitle>Recent Elections</CardTitle>
                                    <CardDescription>Latest elections you can participate in</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { name: "Student Council Election 2024", status: "active", candidates: 5 },
                                        { name: "Community Project Funding", status: "active", candidates: 8 },
                                        { name: "Tech Conference Speaker", status: "ended", candidates: 12 },
                                    ].map((election, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            <div>
                                                <p className="font-medium text-sm md:text-base">{election.name}</p>
                                                <p className="text-xs md:text-sm text-muted-foreground">{election.candidates} candidates</p>
                                            </div>
                                            <Badge variant={election.status === "active" ? "default" : "secondary"}>{election.status}</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-in fade-in-50 slide-in-from-right-4 duration-700 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90">
                                <CardHeader>
                                    <CardTitle>Your Activity</CardTitle>
                                    <CardDescription>Your recent voting and election activities</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { action: "Voted in Student Council Election", time: "2 hours ago" },
                                        { action: "Registered as candidate", time: "1 day ago" },
                                        { action: "Created new election", time: "3 days ago" },
                                    ].map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            <p className="font-medium text-sm md:text-base">{activity.action}</p>
                                            <p className="text-xs md:text-sm text-muted-foreground">{activity.time}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
