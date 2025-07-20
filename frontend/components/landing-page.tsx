"use client"

import { Link } from "react-router-dom"
import { Header } from "../components/layout/header"
import { Button } from "../src/components/ui/button"
import { Card, CardContent, CardTitle } from "../src/components/ui/card"
import { ShieldCheck, Eye, Users, Settings, ArrowRight } from "lucide-react"
import { useAccount } from "wagmi"

export default function LandingPage() {
    const { isConnected } = useAccount()

    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 px-4 overflow-hidden">
                    <div className="relative z-10 space-y-6 max-w-3xl animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                            DecentralVote: Secure, Transparent, Decentralized Voting
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Empower your community with blockchain-powered elections. Ensure fairness and trust in every vote.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to={isConnected ? "/dashboard" : "/elections"}>
                                <Button size="lg" className="text-lg px-8 py-6 transition-all duration-200 hover:scale-105">
                                    {isConnected ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 md:py-24 px-4 bg-muted/20">
                    <div className="container mx-auto max-w-6xl space-y-12 text-center">
                        <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose DecentralVote?</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Leveraging blockchain technology to bring unparalleled integrity and accessibility to your voting
                                processes.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: "Unbreakable Security",
                                    description: "Votes are recorded on an immutable blockchain, preventing tampering and fraud.",
                                },
                                {
                                    icon: Eye,
                                    title: "Absolute Transparency",
                                    description: "Every vote is verifiable, ensuring complete openness and trust in results.",
                                },
                                {
                                    icon: Users,
                                    title: "User-Friendly Interface",
                                    description:
                                        "Intuitive design makes it easy for anyone to create, manage, and participate in elections.",
                                },
                                {
                                    icon: Settings,
                                    title: "Admin Controls",
                                    description:
                                        "Powerful tools for election creators to manage candidates, declare results, and oversee the process.",
                                },
                            ].map((feature, index) => (
                                <Card
                                    key={feature.title}
                                    className="p-6 space-y-4 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in-50 zoom-in-95"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                                    <CardContent className="p-0 text-muted-foreground text-sm">{feature.description}</CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 md:py-24 px-4">
                    <div className="container mx-auto max-w-6xl space-y-12 text-center">
                        <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Participating in decentralized elections is simple and straightforward.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    step: 1,
                                    title: "Connect Your Wallet",
                                    description: "Securely link your Ethereum wallet to the platform.",
                                },
                                { step: 2, title: "Explore Elections", description: "Browse active elections or create your own." },
                                {
                                    step: 3,
                                    title: "Cast Your Vote",
                                    description: "Select your preferred candidate and submit your vote on-chain.",
                                },
                                {
                                    step: 4,
                                    title: "View Results",
                                    description: "See real-time vote counts and final, verifiable results.",
                                },
                            ].map((item, index) => (
                                <div
                                    key={item.step}
                                    className="space-y-3 animate-in fade-in-50 slide-in-from-bottom-8"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground mx-auto text-xl font-bold">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-20 md:py-24 px-4 bg-primary/10">
                    <div className="container mx-auto max-w-4xl text-center space-y-8 animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to Make Your Voice Heard?</h2>
                        <p className="text-lg text-muted-foreground">
                            Join DecentralVote today and experience the future of secure and transparent elections.
                        </p>
                        <Link to={isConnected ? "/dashboard" : "/elections"}>
                            <Button size="lg" className="text-lg px-8 py-6 transition-all duration-200 hover:scale-105">
                                {isConnected ? "Go to Dashboard" : "Start Voting Now"} <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
} 