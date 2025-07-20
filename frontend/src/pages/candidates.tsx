"use client"

import { useState } from "react"
import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Search, Users } from "lucide-react"

// TODO: Fetch and display real candidate data from the contract here.
// All mock/demo data has been removed.

export default function Candidates() {
    const [searchTerm, setSearchTerm] = useState("")

    // TODO: Filter candidates based on real data from the contract.
    type Candidate = { id: string; name: string; address: string; electionName: string }
    const filteredCandidates: Candidate[] = []

    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Candidates</h1>
                            <p className="text-muted-foreground">Browse all registered candidates across elections</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search candidates or elections..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 transition-all duration-200 focus:scale-105 backdrop-blur-sm bg-background/80"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredCandidates.map((candidate, index) => (
                                <Card
                                    key={candidate.id}
                                    className="transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardContent className="flex items-center space-x-4 p-6">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>
                                                {candidate.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{candidate.name}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {candidate.address.slice(0, 6)}...{candidate.address.slice(-4)}
                                            </CardDescription>
                                            <p className="text-xs text-muted-foreground mt-1">In: {candidate.electionName}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredCandidates.length === 0 && (
                            <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 backdrop-blur-sm bg-background/80 border-border/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        {searchTerm ? "Try adjusting your search terms" : "No candidates have registered yet."}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
