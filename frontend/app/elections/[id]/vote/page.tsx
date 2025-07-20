"use client"

import * as React from "react"
import { Header } from "../../../../components/layout/header"
import { Sidebar } from "../../../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../src/components/ui/card"
import { Button } from "../../../../src/components/ui/button"
import { Avatar, AvatarFallback } from "../../../../src/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "../../../../src/components/ui/radio-group"
import { Label } from "../../../../src/components/ui/label"
import { useToast } from "../../../../src/hooks/use-toast"
import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAccount, useWriteContract } from "wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../../../../src/lib/contract"
import { Vote, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "../../../../src/components/ui/alert"

// Remove mockElection, mockCandidates and related demo code
// TODO: Fetch election and candidates from contract and display here

export default function VotePage() {
    const params = useParams()
    const navigate = useNavigate()
    const { isConnected } = useAccount()
    const { writeContract } = useWriteContract()
    const { toast } = useToast()

    const [selectedCandidate, setSelectedCandidate] = useState("")
    const [isVoting, setIsVoting] = useState(false)
    const [hasVoted, setHasVoted] = useState(false) // This should come from contract

    const electionId = params.id as string

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
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-6">
                        <div className="max-w-2xl mx-auto">
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Vote className="h-16 w-16 text-green-500 mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Vote Cast Successfully!</h2>
                                    <p className="text-muted-foreground text-center mb-6">
                                        Your vote has been recorded on the blockchain and cannot be changed.
                                    </p>
                                    <Button onClick={() => navigate(`/elections/${electionId}`)}>Back to Election</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">Cast Your Vote</h1>
                            <p className="text-muted-foreground">Election Name Placeholder</p>
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Important:</strong> Your vote will be recorded on the blockchain and cannot be changed once
                                submitted. Please review your selection carefully before voting.
                            </AlertDescription>
                        </Alert>

                        <Card>
                            <CardHeader>
                                <CardTitle>Select a Candidate</CardTitle>
                                <CardDescription>Choose the candidate you want to vote for in this election</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                                    <div className="space-y-4">
                                        {/* Candidates will be fetched from contract here */}
                                        {/* Example: */}
                                        {/* {candidates.map((candidate) => ( */}
                                        {/*     <div */}
                                        {/*         key={candidate.id} */}
                                        {/*         className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50" */}
                                        {/*     > */}
                                        {/*         <RadioGroupItem value={candidate.id.toString()} id={`candidate-${candidate.id}`} /> */}
                                        {/*         <Label */}
                                        {/*             htmlFor={`candidate-${candidate.id}`} */}
                                        {/*             className="flex items-center space-x-4 cursor-pointer flex-1" */}
                                        {/*         > */}
                                        {/*             <Avatar> */}
                                        {/*                 <AvatarFallback> */}
                                        {/*                     {candidate.name */}
                                        {/*                         .split(" ") */}
                                        {/*                         .map((n) => n[0]) */}
                                        {/*                         .join("")} */}
                                        {/*                 </AvatarFallback> */}
                                        {/*             </Avatar> */}
                                        {/*             <div> */}
                                        {/*                 <p className="font-medium">{candidate.name}</p> */}
                                        {/*                 <p className="text-sm text-muted-foreground"> */}
                                        {/*                     {candidate.address.slice(0, 6)}...{candidate.address.slice(-4)} */}
                                        {/*                 </p> */}
                                        {/*             </div> */}
                                        {/*         </Label> */}
                                        {/*     </div> */}
                                        {/* ))} */}
                                    </div>
                                </RadioGroup>

                                {/* {candidates.length === 0 && ( */}
                                {/*     <div className="text-center py-8"> */}
                                {/*         <p className="text-muted-foreground">No candidates have registered for this election yet.</p> */}
                                {/*     </div> */}
                                {/* )} */}
                            </CardContent>
                        </Card>

                        <div className="flex space-x-4">
                            <Button variant="outline" onClick={() => navigate(-1)} disabled={isVoting}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleVote}
                                disabled={!selectedCandidate || isVoting || !isConnected || /* candidates.length === 0 */ false}
                                className="flex-1"
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
