// Contract ABI and address - replace with your actual contract details
export const VOTING_CONTRACT_ADDRESS = "0xe4E8Db2473D93Cc478Bb4dc83c2692DBE3FC7410";
export const VOTING_CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "electionId", "type": "uint256" },
            { "indexed": false, "internalType": "address", "name": "candidate", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "name", "type": "string" }
        ],
        "name": "CandidateRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "electionId", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
            { "indexed": false, "internalType": "address", "name": "admin", "type": "address" }
        ],
        "name": "ElectionCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "electionId", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "winnerCandidateId", "type": "uint256" }
        ],
        "name": "ResultDeclared",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "electionId", "type": "uint256" },
            { "indexed": false, "internalType": "address", "name": "voter", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "candidateId", "type": "uint256" }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" }
        ],
        "name": "createElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" }
        ],
        "name": "declareResult",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "electionCount",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "name": "elections",
        "outputs": [
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "address", "name": "admin", "type": "address" },
            { "internalType": "bool", "name": "isActive", "type": "bool" },
            { "internalType": "bool", "name": "isResultDeclared", "type": "bool" },
            { "internalType": "uint256", "name": "winnerCandidateId", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" }
        ],
        "name": "getCandidates",
        "outputs": [
            { "internalType": "address[]", "name": "", "type": "address[]" },
            { "internalType": "string[]", "name": "", "type": "string[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" }
        ],
        "name": "getResults",
        "outputs": [
            { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" }
        ],
        "name": "getTotalVotes",
        "outputs": [
            { "internalType": "uint256", "name": "total", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
            { "internalType": "string", "name": "_candidateName", "type": "string" }
        ],
        "name": "registerCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" }
        ],
        "name": "viewVotes",
        "outputs": [
            { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_electionId", "type": "uint256" },
            { "internalType": "uint256", "name": "_candidateId", "type": "uint256" }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
