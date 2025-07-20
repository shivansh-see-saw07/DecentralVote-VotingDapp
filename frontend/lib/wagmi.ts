import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

export const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [
        injected(),
        walletConnect({ projectId: "YOUR_PROJECT_ID" }), // Replace with your actual project ID
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})
