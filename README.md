# DecentralVote - Blockchain Voting DApp

A secure, transparent, and decentralized voting platform built with React, Vite, Tailwind CSS, and Ethereum smart contracts.

## Features
- Create and manage elections on the blockchain
- Register as a candidate
- Cast votes securely (one vote per account)
- Admin dashboard for election creators
- Real-time results and transparency
- Modern, responsive UI with dark mode

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Wagmi, Viem
- **Smart Contract:** Solidity (Voting.sol)
- **Wallet:** MetaMask, WalletConnect
- **Deployment:** Vercel

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/voting-dapp.git
cd voting-dapp/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `frontend` directory:
```
VITE_SEPOLIA_RPC_URL=your_sepolia_rpc_url
VITE_VOTING_CONTRACT_ADDRESS=your_contract_address
```

### 4. Run Locally
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```


## License
[MIT](LICENSE)
