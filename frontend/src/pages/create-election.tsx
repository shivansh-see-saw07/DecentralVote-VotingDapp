"use client"

import type React from "react"
import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { useToast } from "../hooks/use-toast"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAccount, useWriteContract } from "wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../lib/contract"

export default function CreateElection() {
    const [electionName, setElectionName] = useState("")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()
    const { isConnected } = useAccount()
    const { writeContract } = useWriteContract()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to create an election.",
                variant: "destructive",
            })
            return
        }

        if (!electionName.trim()) {
            toast({
                title: "Election name required",
                description: "Please enter a name for your election.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            // Call smart contract function
            await writeContract({
                address: VOTING_CONTRACT_ADDRESS,
                abi: VOTING_CONTRACT_ABI,
                functionName: "createElection",
                args: [electionName],
            })

            toast({
                title: "Election created successfully!",
                description: "Your election has been created and is now active.",
            })

            navigate("/elections")
        } catch (error) {
            console.error("Error creating election:", error)
            toast({
                title: "Failed to create election",
                description: "There was an error creating your election. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Create New Election</h1>
                            <p className="text-muted-foreground">Set up a new election for your community or organization</p>
                        </div>

                        <Card className="backdrop-blur-sm bg-background/80 border-border/50">
                            <CardHeader>
                                <CardTitle>Election Details</CardTitle>
                                <CardDescription>Provide the basic information for your election</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="election-name">Election Name *</Label>
                                        <Input
                                            id="election-name"
                                            placeholder="e.g., Student Council Election 2024"
                                            value={electionName}
                                            onChange={(e) => setElectionName(e.target.value)}
                                            required
                                            className="transition-all duration-200 focus:scale-105"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Provide additional details about the election..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={4}
                                            className="transition-all duration-200 focus:scale-105"
                                        />
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg backdrop-blur-sm">
                                        <h3 className="font-semibold mb-2">Election Settings</h3>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Election will be active immediately after creation</li>
                                            <li>• Users can register as candidates after election is created</li>
                                            <li>• Only you (the creator) can declare results</li>
                                            <li>• Each user can vote only once per election</li>
                                        </ul>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => navigate(-1)}
                                            disabled={isLoading}
                                            className="transition-all duration-200 hover:scale-105"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !isConnected}
                                            className="transition-all duration-200 hover:scale-105"
                                        >
                                            {isLoading ? "Creating..." : "Create Election"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
