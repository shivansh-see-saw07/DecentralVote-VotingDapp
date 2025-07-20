"use client"
import { Header } from "../../components/layout/header"
import { Sidebar } from "../../components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Trophy, BarChart3 } from "lucide-react"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { publicClient } from "../lib/wagmi"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "../lib/contract"

export default function Results() {
    const params = useParams()
    const electionId = params.id as string
    const [results, setResults] = useState<number[]>([])
    const [candidates, setCandidates] = useState<string[]>([])
    const [electionName, setElectionName] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!electionId) return
        setLoading(true)
        setError("")
        const fetchResults = async () => {
            try {
                // Fetch election name
                const electionTuple = await publicClient.readContract({
                    address: VOTING_CONTRACT_ADDRESS,
                    abi: VOTING_CONTRACT_ABI,
                    functionName: "elections",
                    args: [Number(electionId)],
                }) as [string, string, boolean, boolean, bigint]
                setElectionName(electionTuple[0])
                // Fetch candidate names
                const result = await publicClient.readContract({
                    address: VOTING_CONTRACT_ADDRESS,
                    abi: VOTING_CONTRACT_ABI,
                    functionName: "getCandidates",
                    args: [Number(electionId)],
                })
                const names = Array.isArray(result) && Array.isArray(result[1]) ? result[1] : []
                setCandidates(names)
                // Fetch results
                const res = await publicClient.readContract({
                    address: VOTING_CONTRACT_ADDRESS,
                    abi: VOTING_CONTRACT_ABI,
                    functionName: "getResults",
                    args: [Number(electionId)],
                })
                setResults(Array.isArray(res) ? res.map(Number) : [])
            } catch (err: any) {
                setError("No results declared yet or error fetching results.")
                setResults([])
                setCandidates([])
            } finally {
                setLoading(false)
            }
        }
        fetchResults()
    }, [electionId])

    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Results: {electionName}</h1>
                            <p className="text-muted-foreground">Final outcome for this election</p>
                        </div>
                        <div className="space-y-6">
                            {loading ? (
                                <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 backdrop-blur-sm bg-background/80 border-border/50">
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Loading results...</h3>
                                    </CardContent>
                                </Card>
                            ) : error ? (
                                <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 backdrop-blur-sm bg-background/80 border-border/50">
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">{error}</h3>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 backdrop-blur-sm bg-background/80 border-border/50">
                                    <CardHeader>
                                        <CardTitle>Results</CardTitle>
                                        <CardDescription>Votes per candidate</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {results.length === 0 ? (
                                            <p>No candidates or votes found.</p>
                                        ) : (
                                            results.map((votes, i) => (
                                                <div key={i} className="flex justify-between border-b py-2">
                                                    <span>{candidates[i] ? candidates[i] : `Candidate #${i + 1}`}</span>
                                                    <span className="font-bold">{votes} votes</span>
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
