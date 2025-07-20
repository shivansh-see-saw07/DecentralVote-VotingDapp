import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"
import { createPublicClient, http as viemHttp } from 'viem'

export const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [
        injected(),
        walletConnect({ projectId: "8b74f274167e513033b3ad10ca1b057e" }),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: viemHttp(import.meta.env.SEPOLIA_RPC_URL),
})
