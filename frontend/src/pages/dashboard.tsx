import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Vote, Users, Trophy, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useContractRead } from "wagmi"
import { publicClient } from "../lib/wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../lib/contract"

export default function Dashboard() {
    const { isConnected } = useAccount()

    const [totalElections, setTotalElections] = useState(0)
    const [totalCandidates, setTotalCandidates] = useState(0)
    const [totalVotes, setTotalVotes] = useState(0)
    const [activeElections, setActiveElections] = useState(0)

    // Get the number of elections
    const { data: electionCount } = useContractRead({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VOTING_CONTRACT_ABI,
        functionName: "electionCount",
    })

    useEffect(() => {
        if (!electionCount) return
        const fetchStats = async () => {
            let candidatesSum = 0
            let votesSum = 0
            let activeCount = 0
            for (let i = 0; i < Number(electionCount); i++) {
                // Get election status
                let isActive = false
                let isResultDeclared = false
                try {
                    const tuple = await publicClient.readContract({
                        address: VOTING_CONTRACT_ADDRESS,
                        abi: VOTING_CONTRACT_ABI,
                        functionName: "elections",
                        args: [i],
                    }) as [string, string, boolean, boolean, bigint]
                    isActive = tuple[2]
                    isResultDeclared = tuple[3]
                } catch { }
                if (isActive && !isResultDeclared) activeCount++
                // Get candidates for each election
                try {
                    const result = await publicClient.readContract({
                        address: VOTING_CONTRACT_ADDRESS,
                        abi: VOTING_CONTRACT_ABI,
                        functionName: "getCandidates",
                        args: [i],
                    })
                    const addresses = Array.isArray(result) ? result[0] : []
                    candidatesSum += addresses.length
                } catch { }
                // Get total votes for each election
                try {
                    const total = await publicClient.readContract({
                        address: VOTING_CONTRACT_ADDRESS,
                        abi: VOTING_CONTRACT_ABI,
                        functionName: "getTotalVotes",
                        args: [i],
                    })
                    votesSum += Number(total)
                } catch { }
            }
            setActiveElections(activeCount)
            setTotalElections(Number(electionCount))
            setTotalCandidates(candidatesSum)
            setTotalVotes(votesSum)
        }
        fetchStats()
    }, [electionCount])

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background">
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
                            <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs md:text-sm font-medium">Active Elections</CardTitle>
                                    <Vote className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl md:text-2xl font-bold">{activeElections}</div>
                                    <p className="text-xs text-muted-foreground">Live on-chain</p>
                                </CardContent>
                            </Card>
                            <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs md:text-sm font-medium">Total Candidates</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl md:text-2xl font-bold">{totalCandidates}</div>
                                    <p className="text-xs text-muted-foreground">Across all elections</p>
                                </CardContent>
                            </Card>
                            <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs md:text-sm font-medium">Total Votes Cast</CardTitle>
                                    <Trophy className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl md:text-2xl font-bold">{totalVotes}</div>
                                    <p className="text-xs text-muted-foreground">On-chain</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-in fade-in-50 slide-in-from-left-4 duration-700 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90">
                                <CardHeader>
                                    <CardTitle>Total Elections</CardTitle>
                                    <CardDescription>Number of elections on the platform</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-2 rounded-lg">
                                        <div>
                                            <p className="font-medium text-2xl">{totalElections}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-in fade-in-50 slide-in-from-left-4 duration-700 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90">
                                <CardHeader>
                                    <CardTitle>Total Candidates</CardTitle>
                                    <CardDescription>Number of candidates across all elections</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-2 rounded-lg">
                                        <div>
                                            <p className="font-medium text-2xl">{totalCandidates}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-in fade-in-50 slide-in-from-left-4 duration-700 backdrop-blur-sm bg-background/80 border-border/50 hover:bg-background/90">
                                <CardHeader>
                                    <CardTitle>Total Votes</CardTitle>
                                    <CardDescription>Total votes cast across all elections</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-2 rounded-lg">
                                        <div>
                                            <p className="font-medium text-2xl">{totalVotes}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
