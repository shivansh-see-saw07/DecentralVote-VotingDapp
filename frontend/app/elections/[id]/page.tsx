"use client"

import * as React from "react"

import { Header } from "../../../components/layout/header"
import { Sidebar } from "../../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../src/components/ui/card"
import { Button } from "../../../src/components/ui/button"
import { Badge } from "../../../src/components/ui/badge"
import { Avatar, AvatarFallback } from "../../../src/components/ui/avatar"
import { Input } from "../../../src/components/ui/input"
import { Label } from "../../../src/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../src/components/ui/dialog"
import { useToast } from "../../../src/hooks/use-toast"
import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAccount, useWriteContract } from "wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../../../src/lib/contract"
import { Vote, Users, Trophy, Clock, Plus } from "lucide-react"

// Remove mockElection, mockCandidates and related demo code
// TODO: Fetch election and candidates from contract and display here

export default function ElectionDetails() {
    const params = useParams()
    const navigate = useNavigate()
    const { address, isConnected } = useAccount()
    const { writeContract } = useWriteContract()
    const { toast } = useToast()

    const [candidateName, setCandidateName] = useState("")
    const [isRegistering, setIsRegistering] = useState(false)
    const [hasVoted, setHasVoted] = useState(false) // This should come from contract
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const isCreator = address === "0x1234567890123456789012345678901234567890" // Placeholder for actual creator
    const electionId = params.id as string

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
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">Election Name Placeholder</h1>
                                <p className="text-muted-foreground">
                                    Creator: 0x1234...5678
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
                                    <div className="text-2xl font-bold">0</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                                    <Vote className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        0
                                    </div>
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

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Candidates</CardTitle>
                                        <CardDescription>Registered candidates for this election</CardDescription>
                                    </div>
                                    {true && ( // Placeholder for election.isActive
                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Register as Candidate
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
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
                                                        />
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setIsDialogOpen(false)}
                                                            disabled={isRegistering}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button type="submit" disabled={isRegistering || !isConnected}>
                                                            {isRegistering ? "Registering..." : "Register"}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Render candidates here when ready */}
                                </div>

                                {/* Render no candidates message here when ready */}
                            </CardContent>
                        </Card>

                        {true && ( // Placeholder for voting and results buttons
                            <div className="flex space-x-4">
                                <Button
                                    onClick={() => navigate(`/elections/${electionId}/vote`)}
                                    disabled={hasVoted}
                                    className="flex-1"
                                >
                                    {hasVoted ? "Already Voted" : "Cast Your Vote"}
                                </Button>
                                {isCreator && <Button variant="outline">Declare Results</Button>}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
