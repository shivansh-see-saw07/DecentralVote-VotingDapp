"use client"

import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { useToast } from "../hooks/use-toast"
import { useEffect, useState } from "react"
import { useAccount, useContractRead, useWriteContract } from "wagmi"
import { config, publicClient } from "../lib/wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../lib/contract"
import { BarChart3, Users, Vote, Settings, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../components/ui/dialog"
import { readContract } from "@wagmi/core"

// Remove mockMyElections and related demo code
// TODO: Fetch admin's elections from contract and display here

export default function AdminDashboard() {
    const { address } = useAccount()
    const [myElections, setMyElections] = useState<any[]>([])
    const { toast } = useToast()
    const [votesModal, setVotesModal] = useState<{ open: boolean; votes: number[]; names: string[]; electionName: string } | null>(null)
    const [loadingVotes, setLoadingVotes] = useState(false)
    const [declaringId, setDeclaringId] = useState<number | null>(null)
    const { writeContract } = useWriteContract()

    // Get the number of elections
    const { data: electionCount } = useContractRead({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VOTING_CONTRACT_ABI,
        functionName: "electionCount",
    })

    useEffect(() => {
        if (!electionCount || !address) return
        const fetchElections = async () => {
            const promises = []
            for (let i = 0; i < Number(electionCount); i++) {
                promises.push(
                    publicClient.readContract({
                        address: VOTING_CONTRACT_ADDRESS,
                        abi: VOTING_CONTRACT_ABI,
                        functionName: "elections",
                        args: [i],
                    })
                )
            }
            const results = await Promise.all(promises)
            const mapped = results.map((e, i) => {
                const arr = e as any[];
                return {
                    name: arr[0],
                    admin: arr[1],
                    isActive: arr[2],
                    isResultDeclared: arr[3],
                    winnerCandidateId: arr[4],
                    id: i,
                };
            });
            console.log('All elections:', mapped)
            console.log('Current address:', address)
            // Log admin address for each election
            mapped.forEach((election, idx) => {
                console.log(`Election #${idx} admin:`, election.admin, '| Connected:', address)
            })
            const mine = mapped.filter(election => election.admin && election.admin.toLowerCase() === address.toLowerCase())
            setMyElections(mine)
        }
        fetchElections()
    }, [electionCount, address])

    if (!address) {
        return (
            <div className="min-h-screen bg-background relative">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-4 md:p-6">
                        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                            <Card className="w-full max-w-md backdrop-blur-sm bg-background/80 border-border/50 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Settings className="h-6 w-6 text-primary" />
                                    </div>
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

    const handleDeclareResult = async (electionId: number) => {
        setDeclaringId(electionId)
        try {
            await writeContract({
                address: VOTING_CONTRACT_ADDRESS,
                abi: VOTING_CONTRACT_ABI,
                functionName: "declareResult",
                args: [BigInt(electionId)],
            })
            toast({ title: "Result declared!", description: "Election result has been declared." })
        } catch (err) {
            toast({ title: "Error", description: "Failed to declare result.", variant: "destructive" })
        } finally {
            setDeclaringId(null)
        }
    }

    const handleViewVotes = async (electionId: number, electionName: string) => {
        setLoadingVotes(true)
        try {
            console.log('Fetching votes for electionId:', electionId, 'from address:', address)
            // Fetch votes
            const votes = await readContract(config, {
                address: VOTING_CONTRACT_ADDRESS,
                abi: VOTING_CONTRACT_ABI,
                functionName: "viewVotes",
                args: [electionId],
                account: address,
            })
            // Fetch candidate names
            const result = await publicClient.readContract({
                address: VOTING_CONTRACT_ADDRESS,
                abi: VOTING_CONTRACT_ABI,
                functionName: "getCandidates",
                args: [electionId],
            })
            const names = Array.isArray(result) && Array.isArray(result[1]) ? result[1] : []
            setVotesModal({ open: true, votes: Array.isArray(votes) ? votes.map(Number) : [], names, electionName })
        } catch (err) {
            console.error('Error fetching votes or candidates:', err)
            toast({ title: "Error", description: "Failed to fetch votes or candidates.", variant: "destructive" })
        } finally {
            setLoadingVotes(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                            <p className="text-muted-foreground">Manage your elections and view live statistics</p>
                        </div>
                        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">My Elections</CardTitle>
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{myElections.length}</div>
                                    <p className="text-xs text-muted-foreground">Created by you</p>
                                </CardContent>
                            </Card>
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold">My Elections</h2>
                        {myElections.length === 0 ? (
                            <Card className="backdrop-blur-sm bg-background/80 border-border/50 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No elections created</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        You haven't created any elections yet. Create your first election to get started.
                                    </p>
                                    <Button className="transition-all duration-200 hover:scale-105">Create Election</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {myElections.map((election, index) => (
                                    <Card key={election.id} className="backdrop-blur-sm bg-background/80 border-border/50 animate-in fade-in-50 slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 200}ms` }}>
                                        <CardHeader>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <CardTitle className="text-lg md:text-xl">{election.name}</CardTitle>
                                                    <CardDescription>
                                                        {/* TODO: Show candidate count and total votes if available */}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant={election.isActive ? "default" : "secondary"}>
                                                        {election.isActive ? "Active" : "Ended"}
                                                    </Badge>
                                                    {election.isResultDeclared && <Badge variant="outline">Results Declared</Badge>}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-4">
                                                {!election.isResultDeclared && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleViewVotes(election.id, election.name)}
                                                        disabled={loadingVotes}
                                                    >
                                                        {loadingVotes ? "Loading Votes..." : "View Votes"}
                                                    </Button>
                                                )}
                                                {election.isActive && !election.isResultDeclared && (
                                                    <Button
                                                        onClick={() => handleDeclareResult(election.id)}
                                                        disabled={declaringId === election.id}
                                                    >
                                                        {declaringId === election.id ? "Declaring..." : "Declare Results"}
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {/* Votes Modal */}
                                {votesModal?.open && (
                                    <Dialog open={votesModal.open} onOpenChange={() => setVotesModal(null)}>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Votes for {votesModal.electionName}</DialogTitle>
                                                <DialogDescription>Votes per candidate (admin only, before results declared)</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                {votesModal.votes.length === 0 ? (
                                                    <p>No candidates or votes yet.</p>
                                                ) : (
                                                    votesModal.votes.map((v, i) => (
                                                        <div key={i} className="flex justify-between">
                                                            <span>{votesModal.names[i] ? votesModal.names[i] : `Candidate #${i + 1}`}</span>
                                                            <span>{v} votes</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <Button onClick={() => setVotesModal(null)} className="mt-4 w-full">Close</Button>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
