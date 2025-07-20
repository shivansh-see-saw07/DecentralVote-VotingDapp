"use client"
import * as React from "react"
import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Button } from "../../src/components/ui/button"
import { Badge } from "../../src/components/ui/badge"
import { Input } from "../../src/components/ui/input"
import { Search, Plus, Users, Clock, Vote } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

// Remove mockElections and related demo code
// TODO: Fetch elections from contract and display here

export default function Elections() {
    const [searchTerm, setSearchTerm] = useState("")

    // Remove mockElections and related demo code
    // TODO: Fetch elections from contract and display here
    const filteredElections = [] // Placeholder for filtered elections

    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Elections</h1>
                                <p className="text-muted-foreground">Browse and participate in active elections</p>
                            </div>
                            <Link to="/elections/create">
                                <Button className="w-full sm:w-auto transition-all duration-200 hover:scale-105">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Election
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search elections..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 transition-all duration-200 focus:scale-105 backdrop-blur-sm bg-background/80"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredElections.map((election, index) => (
                                <Card
                                    key={election.id}
                                    className="transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base md:text-lg line-clamp-2">{election.name}</CardTitle>
                                            <Badge
                                                variant={election.isActive ? "default" : election.resultDeclared ? "secondary" : "destructive"}
                                                className="shrink-0"
                                            >
                                                {election.isActive ? "Active" : election.resultDeclared ? "Completed" : "Ended"}
                                            </Badge>
                                        </div>
                                        <CardDescription className="truncate">Created by {election.creator}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center">
                                                <Users className="mr-1 h-4 w-4" />
                                                {election.candidateCount} candidates
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-4 w-4" />
                                                {election.totalVotes} votes
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Link to={`/elections/${election.id}`} className="flex-1">
                                                <Button
                                                    variant="outline"
                                                    className="w-full bg-transparent transition-all duration-200 hover:scale-105"
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                            {election.isActive && (
                                                <Link to={`/elections/${election.id}/vote`} className="flex-1">
                                                    <Button className="w-full transition-all duration-200 hover:scale-105">Vote Now</Button>
                                                </Link>
                                            )}
                                            {election.resultDeclared && (
                                                <Link to={`/elections/${election.id}/results`} className="flex-1">
                                                    <Button variant="secondary" className="w-full transition-all duration-200 hover:scale-105">
                                                        View Results
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredElections.length === 0 && (
                            <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 backdrop-blur-sm bg-background/80 border-border/50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Vote className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No elections found</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        {searchTerm ? "Try adjusting your search terms" : "Be the first to create an election!"}
                                    </p>
                                    <Link to="/elections/create">
                                        <Button className="transition-all duration-200 hover:scale-105">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Election
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
