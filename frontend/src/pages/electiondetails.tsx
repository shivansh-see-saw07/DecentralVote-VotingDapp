"use client"

import type React from "react"
import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog"
import { useToast } from "../hooks/use-toast"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAccount, useWriteContract, usePublicClient } from "wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../lib/contract"
import { Users, Vote, Plus, Clock } from "lucide-react"

// Remove mockElection, mockCandidates and related demo code
// TODO: Fetch election and candidates from contract and display here

export default function ElectionDetails() {
    const params = useParams()
    const electionId = params.id as string
    const navigate = useNavigate()
    const { address, isConnected } = useAccount()
    const { writeContract } = useWriteContract()
    const { toast } = useToast()
    const publicClient = usePublicClient()

    const [candidateName, setCandidateName] = useState("")
    const [isRegistering, setIsRegistering] = useState(false)
    const [hasVoted, setHasVoted] = useState(false) // This should come from contract
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [candidates, setCandidates] = useState<{ address: string; name: string }[]>([])
    const [totalVotes, setTotalVotes] = useState<number>(0)
    const [electionName, setElectionName] = useState("")

    useEffect(() => {
        if (!electionId) return
        const fetchElectionAndCandidates = async () => {
            try {
                // Fetch election name
                const [name] = await publicClient!.readContract({
                    address: VOTING_CONTRACT_ADDRESS,
                    abi: VOTING_CONTRACT_ABI,
                    functionName: "elections",
                    args: [Number(electionId)],
                }) as [string, string, boolean, boolean, number];
                setElectionName(name)
                // Fetch candidates
                const [addresses, names] = await publicClient!.readContract({
                    address: VOTING_CONTRACT_ADDRESS,
                    abi: VOTING_CONTRACT_ABI,
                    functionName: "getCandidates",
                    args: [Number(electionId)],
                }) as [string[], string[]];
                const mapped = names.map((name: string, idx: number) => ({
                    address: addresses[idx],
                    name,
                }))
                setCandidates(mapped)
                // Fetch total votes
                try {
                    const total = await publicClient!.readContract({
                        address: VOTING_CONTRACT_ADDRESS,
                        abi: VOTING_CONTRACT_ABI,
                        functionName: "getTotalVotes",
                        args: [Number(electionId)],
                    })
                    setTotalVotes(Number(total))
                } catch (err) {
                    setTotalVotes(0)
                }
            } catch (err) {
                setElectionName("Election Name")
                setCandidates([])
                setTotalVotes(0)
            }
        }
        fetchElectionAndCandidates()
    }, [electionId])

    const isCreator = false // TODO: Set this based on real election data

    const handleRegisterCandidate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to register as a candidate.",
                variant: "destructive",
            })
            return
        }

        if (!candidateName.trim()) {
            toast({
                title: "Name required",
                description: "Please enter your name to register as a candidate.",
                variant: "destructive",
            })
            return
        }

        setIsRegistering(true)

        try {
            await writeContract({
                address: VOTING_CONTRACT_ADDRESS,
                abi: VOTING_CONTRACT_ABI,
                functionName: "registerCandidate",
                args: [BigInt(electionId), candidateName],
            })

            toast({
                title: "Registration successful!",
                description: "You have been registered as a candidate.",
            })

            setCandidateName("")
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Error registering candidate:", error)
            toast({
                title: "Registration failed",
                description: "There was an error registering as a candidate. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsRegistering(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{electionName}</h1>
                                <p className="text-muted-foreground">
                                    Created by ...
                                </p>
                            </div>
                            <Badge variant="default">Active</Badge>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{candidates.length}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                                    <Vote className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalVotes}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Voting</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="backdrop-blur-sm bg-background/80 border-border/50">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Candidates</CardTitle>
                                        <CardDescription>Registered candidates for this election</CardDescription>
                                    </div>
                                    {/* TODO: Show register button if election is active */}
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="transition-all duration-200 hover:scale-105">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Register as Candidate
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="backdrop-blur-sm bg-background/95">
                                            <DialogHeader>
                                                <DialogTitle>Register as Candidate</DialogTitle>
                                                <DialogDescription>
                                                    Enter your name to register as a candidate in this election.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleRegisterCandidate} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate-name">Your Name</Label>
                                                    <Input
                                                        id="candidate-name"
                                                        placeholder="Enter your full name"
                                                        value={candidateName}
                                                        onChange={(e) => setCandidateName(e.target.value)}
                                                        required
                                                        className="transition-all duration-200 focus:scale-105"
                                                    />
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setIsDialogOpen(false)}
                                                        disabled={isRegistering}
                                                        className="transition-all duration-200 hover:scale-105"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={isRegistering || !isConnected}
                                                        className="transition-all duration-200 hover:scale-105"
                                                    >
                                                        {isRegistering ? "Registering..." : "Register"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {candidates.length > 0 ? (
                                        candidates.map((candidate, index) => (
                                            <div
                                                key={candidate.address}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] animate-in fade-in-50 slide-in-from-left-4"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {candidate.name.split(" ").map((n) => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{candidate.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {candidate.address.slice(0, 6)}...{candidate.address.slice(-4)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* TODO: Add vote count and voting button if needed */}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No candidates yet</h3>
                                            <p className="text-muted-foreground">Be the first to register as a candidate in this election!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* TODO: Show voting/results buttons if election is active */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={() => navigate(`/elections/${electionId}/vote`)}
                                disabled={hasVoted}
                                className="flex-1 transition-all duration-200 hover:scale-105"
                            >
                                {hasVoted ? "Already Voted" : "Cast Your Vote"}
                            </Button>
                            {isCreator && (
                                <Button variant="outline" className="transition-all duration-200 hover:scale-105 bg-transparent">
                                    Declare Results
                                </Button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
