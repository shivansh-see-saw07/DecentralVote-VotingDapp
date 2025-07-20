"use client"
import { Button } from "../src/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../src/components/ui/dropdown-menu"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react"
import { useToast } from "../src/hooks/use-toast"

export function WalletConnectButton() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()
    const { toast } = useToast()

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address)
            toast({
                title: "Address copied",
                description: "Wallet address copied to clipboard",
            })
        }
    }

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    if (isConnected && address) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex items-center space-x-2 bg-transparent transition-all duration-200 hover:scale-105"
                    >
                        <Wallet className="h-4 w-4" />
                        <span className="hidden sm:inline">{formatAddress(address)}</span>
                        <span className="sm:hidden">{address.slice(0, 4)}...</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2">
                    <DropdownMenuItem onClick={copyAddress} className="transition-colors duration-200">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => window.open(`https://etherscan.io/address/${address}`, "_blank")}
                        className="transition-colors duration-200"
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Etherscan
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => disconnect()} className="transition-colors duration-200">
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="transition-all duration-200 hover:scale-105">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-in slide-in-from-top-2">
                {connectors.map((connector) => (
                    <DropdownMenuItem
                        key={connector.uid}
                        onClick={() => connect({ connector })}
                        className="transition-colors duration-200"
                    >
                        {connector.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
