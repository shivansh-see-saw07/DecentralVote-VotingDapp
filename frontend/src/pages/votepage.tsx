"use client"

import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { useToast } from "../hooks/use-toast"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAccount, useWriteContract, usePublicClient } from "wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../lib/contract"
import { Vote, AlertCircle } from "lucide-react"

// Remove mockElection, mockCandidates and related demo code
// TODO: Fetch election and candidates from contract and display here

export default function VotePage() {
    const params = useParams()
    const navigate = useNavigate()
    const { isConnected } = useAccount()
    const { writeContract } = useWriteContract()
    const { toast } = useToast()
    const publicClient = usePublicClient()

    const [selectedCandidate, setSelectedCandidate] = useState("")
    const [isVoting, setIsVoting] = useState(false)
    const [hasVoted, setHasVoted] = useState(false) // This should come from contract
    const [candidates, setCandidates] = useState<{ address: string; name: string }[]>([])
    const [electionName, setElectionName] = useState("")

    const electionId = params.id as string

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
            } catch (err) {
                setElectionName("Election Name")
                setCandidates([])
            }
        }
        fetchElectionAndCandidates()
    }, [electionId])

    const handleVote = async () => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to vote.",
                variant: "destructive",
            })
            return
        }

        if (!selectedCandidate) {
            toast({
                title: "No candidate selected",
                description: "Please select a candidate to vote for.",
                variant: "destructive",
            })
            return
        }

        setIsVoting(true)

        try {
            await writeContract({
                address: VOTING_CONTRACT_ADDRESS,
                abi: VOTING_CONTRACT_ABI,
                functionName: "vote",
                args: [BigInt(electionId), BigInt(selectedCandidate)],
            })

            toast({
                title: "Vote cast successfully!",
                description: "Your vote has been recorded on the blockchain.",
            })

            setHasVoted(true)
            setTimeout(() => {
                navigate(`/elections/${electionId}`)
            }, 2000)
        } catch (error) {
            console.error("Error casting vote:", error)
            toast({
                title: "Failed to cast vote",
                description: "There was an error casting your vote. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsVoting(false)
        }
    }

    if (hasVoted) {
        return (
            <div className="min-h-screen bg-background relative">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-4 md:p-6">
                        <div className="max-w-2xl mx-auto">
                            <Card className="backdrop-blur-sm bg-background/80 border-border/50 animate-in fade-in-50 zoom-in-95 duration-500">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                        <Vote className="h-8 w-8 text-green-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Vote Cast Successfully!</h2>
                                    <p className="text-muted-foreground text-center mb-6">
                                        Your vote has been recorded on the blockchain and cannot be changed.
                                    </p>
                                    <Button
                                        onClick={() => navigate(`/elections/${electionId}`)}
                                        className="transition-all duration-200 hover:scale-105"
                                    >
                                        Back to Election
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
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
                    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Cast Your Vote</h1>
                            <p className="text-muted-foreground">{electionName}</p>
                        </div>

                        <Alert className="backdrop-blur-sm bg-background/80 border-border/50">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Important:</strong> Your vote will be recorded on the blockchain and cannot be changed once
                                submitted. Please review your selection carefully before voting.
                            </AlertDescription>
                        </Alert>

                        <Card className="backdrop-blur-sm bg-background/80 border-border/50">
                            <CardHeader>
                                <CardTitle>Select a Candidate</CardTitle>
                                <CardDescription>Choose the candidate you want to vote for in this election</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                                    <div className="space-y-4">
                                        {candidates.length > 0 ? (
                                            candidates.map((candidate, index) => (
                                                <div
                                                    key={candidate.address}
                                                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02] animate-in fade-in-50 slide-in-from-left-4"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <RadioGroupItem value={index.toString()} id={`candidate-${index}`} />
                                                    <Label
                                                        htmlFor={`candidate-${index}`}
                                                        className="flex items-center space-x-4 cursor-pointer flex-1"
                                                    >
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
                                                    </Label>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-muted-foreground">No candidates have registered for this election yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                                disabled={isVoting}
                                className="transition-all duration-200 hover:scale-105"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleVote}
                                disabled={!selectedCandidate || isVoting || !isConnected || candidates.length === 0}
                                className="flex-1 transition-all duration-200 hover:scale-105"
                            >
                                {isVoting ? "Casting Vote..." : "Cast Vote"}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
