"use client"
import * as React from "react"
import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Button } from "../../src/components/ui/button"
import { Badge } from "../../src/components/ui/badge"
import { Progress } from "../../src/components/ui/progress"
import { useToast } from "../../src/hooks/use-toast"
import { useState } from "react"
import { useAccount, useWriteContract } from "wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../../src/lib/contract"
import { BarChart3, Users, Vote, Settings, Eye, EyeOff } from "lucide-react"

// Remove mockMyElections and related demo code
// TODO: Fetch admin's elections from contract and display here

export default function AdminDashboard() {
    const { address, isConnected } = useAccount()
    const { writeContract } = useWriteContract()
    const { toast } = useToast()
    const [showVoteCounts, setShowVoteCounts] = useState<{ [key: number]: boolean }>({})
    const [declaringResults, setDeclaringResults] = useState<{ [key: number]: boolean }>({})

    const toggleVoteCountVisibility = (electionId: number) => {
        setShowVoteCounts((prev) => ({
            ...prev,
            [electionId]: !prev[electionId],
        }))
    }

    const handleDeclareResults = async (electionId: number) => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to declare results.",
                variant: "destructive",
            })
            return
        }

        setDeclaringResults((prev) => ({ ...prev, [electionId]: true }))

        try {
            await writeContract({
                address: VOTING_CONTRACT_ADDRESS,
                abi: VOTING_CONTRACT_ABI,
                functionName: "declareResult",
                args: [BigInt(electionId)],
            })

            toast({
                title: "Results declared successfully!",
                description: "The election results are now public.",
            })
        } catch (error) {
            console.error("Error declaring results:", error)
            toast({
                title: "Failed to declare results",
                description: "There was an error declaring the results. Please try again.",
                variant: "destructive",
            })
        } finally {
            setDeclaringResults((prev) => ({ ...prev, [electionId]: false }))
        }
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-6">
                        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                            <Card className="w-full max-w-md">
                                <CardHeader className="text-center">
                                    <CardTitle>Admin Dashboard</CardTitle>
                                    <CardDescription>Connect your wallet to access the admin dashboard</CardDescription>
                                </CardHeader>
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
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                            <p className="text-muted-foreground">Manage your elections and view live statistics</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">My Elections</CardTitle>
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">0</div>
                                    <p className="text-xs text-muted-foreground">
                                        No elections created yet.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">0</div>
                                    <p className="text-xs text-muted-foreground">Across all elections</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                                    <Vote className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">0</div>
                                    <p className="text-xs text-muted-foreground">Cast in your elections</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg. Participation</CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">0%</div>
                                    <p className="text-xs text-muted-foreground">Voter turnout rate</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold">My Elections</h2>

                            {/* TODO: Fetch admin's elections from contract and display here */}
                            {/* {mockMyElections.map((election) => ( */}
                            {/*     <Card key={election.id}> */}
                            {/*         <CardHeader> */}
                            {/*             <div className="flex items-center justify-between"> */}
                            {/*                 <div> */}
                            {/*                     <CardTitle className="text-xl">{election.name}</CardTitle> */}
                            {/*                     <CardDescription> */}
                            {/*                         {election.candidates.length} candidates • {election.totalVotes} total votes */}
                            {/*                     </CardDescription> */}
                            {/*                 </div> */}
                            {/*                 <div className="flex items-center space-x-2"> */}
                            {/*                     <Badge variant={election.isActive ? "default" : "secondary"}> */}
                            {/*                         {election.isActive ? "Active" : "Ended"} */}
                            {/*                     </Badge> */}
                            {/*                     {election.resultDeclared && <Badge variant="outline">Results Declared</Badge>} */}
                            {/*                 </div> */}
                            {/*             </div> */}
                            {/*         </CardHeader> */}
                            {/*         <CardContent className="space-y-4"> */}
                            {/*             <div className="flex items-center justify-between"> */}
                            {/*                 <h3 className="font-semibold">Live Vote Counts</h3> */}
                            {/*                 <Button variant="ghost" size="sm" onClick={() => toggleVoteCountVisibility(election.id)}> */}
                            {/*                     {showVoteCounts[election.id] ? ( */}
                            {/*                         <> */}
                            {/*                             <EyeOff className="mr-2 h-4 w-4" /> */}
                            {/*                             Hide */}
                            {/*                         </> */}
                            {/*                     ) : ( */}
                            {/*                         <> */}
                            {/*                             <Eye className="mr-2 h-4 w-4" /> */}
                            {/*                             Show */}
                            {/*                         </> */}
                            {/*                     )} */}
                            {/*                 </Button> */}
                            {/*             </div> */}

                            {/*             {showVoteCounts[election.id] && ( */}
                            {/*                 <div className="space-y-3"> */}
                            {/*                     {election.candidates */}
                            {/*                         .sort((a, b) => b.voteCount - a.voteCount) */}
                            {/*                         .map((candidate, index) => ( */}
                            {/*                             <div key={candidate.id} className="space-y-2"> */}
                            {/*                                 <div className="flex items-center justify-between"> */}
                            {/*                                     <div className="flex items-center space-x-2"> */}
                            {/*                                         <Badge variant="outline">#{index + 1}</Badge> */}
                            {/*                                         <span className="font-medium">{candidate.name}</span> */}
                            {/*                                     </div> */}
                            {/*                                     <span className="text-sm font-medium"> */}
                            {/*                                         {candidate.voteCount} votes ( */}
                            {/*                                         {((candidate.voteCount / election.totalVotes) * 100).toFixed(1)}%) */}
                            {/*                                     </span> */}
                            {/*                                 </div> */}
                            {/*                                 <Progress value={(candidate.voteCount / election.totalVotes) * 100} className="h-2" /> */}
                            {/*                             </div> */}
                            {/*                         ))} */}
                            {/*                 </div> */}
                            {/*             )} */}

                            {/*             {election.isActive && !election.resultDeclared && ( */}
                            {/*                 <div className="flex justify-end pt-4"> */}
                            {/*                     <Button */}
                            {/*                         onClick={() => handleDeclareResults(election.id)} */}
                            {/*                         disabled={declaringResults[election.id]} */}
                            {/*                     > */}
                            {/*                         {declaringResults[election.id] ? "Declaring..." : "Declare Results"} */}
                            {/*                     </Button> */}
                            {/*                 </div> */}
                            {/*             )} */}
                            {/*         </CardContent> */}
                            {/*     </Card> */}
                            {/* ))} */}

                            {/* {mockMyElections.length === 0 && ( */}
                            {/*     <Card> */}
                            {/*         <CardContent className="flex flex-col items-center justify-center py-12"> */}
                            {/*             <Settings className="h-12 w-12 text-muted-foreground mb-4" /> */}
                            {/*             <h3 className="text-lg font-semibold mb-2">No elections created</h3> */}
                            {/*             <p className="text-muted-foreground text-center mb-4"> */}
                            {/*                 You haven't created any elections yet. Create your first election to get started. */}
                            {/*             </p> */}
                            {/*             <Button>Create Election</Button> */}
                            {/*         </CardContent> */}
                            {/*     </Card> */}
                            {/* )} */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
