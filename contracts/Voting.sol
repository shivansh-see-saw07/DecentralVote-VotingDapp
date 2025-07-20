// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Voting {
    struct Candidate {
        address candidateAddress;
        string name;
        uint voteCount;
    }

    struct Election {
        string name;
        address admin;
        bool isActive;
        bool isResultDeclared;
        Candidate[] candidates;
        mapping(address => bool) hasVoted;
        mapping(address => bool) isCandidate;
        uint winnerCandidateId;
    }

    uint public electionCount;
    mapping(uint => Election) public elections;

    event ElectionCreated(uint indexed electionId, string name, address admin);
    event CandidateRegistered(uint indexed electionId, address candidate, string name);
    event Voted(uint indexed electionId, address voter, uint candidateId);
    event ResultDeclared(uint indexed electionId, uint winnerCandidateId);

    // Create a new election
    function createElection(string memory _name) public {
        Election storage e = elections[electionCount];
        e.name = _name;
        e.admin = msg.sender;
        e.isActive = true;
        e.isResultDeclared = false;
        emit ElectionCreated(electionCount, _name, msg.sender);
        electionCount++;
    }

    // Register as a candidate in an election
    function registerCandidate(uint _electionId, string memory _candidateName) public {
        Election storage e = elections[_electionId];
        require(e.isActive, "Election is not active");
        require(!e.isCandidate[msg.sender], "Already registered as candidate");
        e.candidates.push(Candidate(msg.sender, _candidateName, 0));
        e.isCandidate[msg.sender] = true;
        emit CandidateRegistered(_electionId, msg.sender, _candidateName);
    }

    // Vote for a candidate in an election
    function vote(uint _electionId, uint _candidateId) public {
        Election storage e = elections[_electionId];
        require(e.isActive, "Election is not active");
        require(!e.hasVoted[msg.sender], "Already voted");
        require(_candidateId < e.candidates.length, "Invalid candidate");
        e.candidates[_candidateId].voteCount++;
        e.hasVoted[msg.sender] = true;
        emit Voted(_electionId, msg.sender, _candidateId);
    }

    // View votes for each candidate (admin only, before result declared)
    function viewVotes(uint _electionId) public view returns (uint[] memory) {
        Election storage e = elections[_electionId];
        require(msg.sender == e.admin, "Only admin can view votes");
        require(!e.isResultDeclared, "Result already declared");
        require(e.isActive, "Election is not active");
        uint[] memory votes = new uint[](e.candidates.length);
        for (uint i = 0; i < e.candidates.length; i++) {
            votes[i] = e.candidates[i].voteCount;
        }
        return votes;
    }

    // Declare result (admin only)
    function declareResult(uint _electionId) public {
        Election storage e = elections[_electionId];
        require(msg.sender == e.admin, "Only admin can declare result");
        require(e.isActive, "Election is not active");
        require(!e.isResultDeclared, "Result already declared");
        e.isActive = false;
        e.isResultDeclared = true;
        uint maxVotes = 0;
        uint winnerId = 0;
        for (uint i = 0; i < e.candidates.length; i++) {
            if (e.candidates[i].voteCount > maxVotes) {
                maxVotes = e.candidates[i].voteCount;
                winnerId = i;
            }
        }
        e.winnerCandidateId = winnerId;
        emit ResultDeclared(_electionId, winnerId);
    }

    // Get results (public, after result declared)
    function getResults(uint _electionId) public view returns (uint[] memory) {
        Election storage e = elections[_electionId];
        require(e.isResultDeclared, "Result not declared yet");
        uint[] memory votes = new uint[](e.candidates.length);
        for (uint i = 0; i < e.candidates.length; i++) {
            votes[i] = e.candidates[i].voteCount;
        }
        return votes;
    }

    // Get candidate info for an election
    function getCandidates(uint _electionId) public view returns (address[] memory, string[] memory) {
        Election storage e = elections[_electionId];
        address[] memory addrs = new address[](e.candidates.length);
        string[] memory names = new string[](e.candidates.length);
        for (uint i = 0; i < e.candidates.length; i++) {
            addrs[i] = e.candidates[i].candidateAddress;
            names[i] = e.candidates[i].name;
        }
        return (addrs, names);
    }

    // Get total votes cast in an election (public)
    function getTotalVotes(uint _electionId) public view returns (uint total) {
        Election storage e = elections[_electionId];
        for (uint i = 0; i < e.candidates.length; i++) {
            total += e.candidates[i].voteCount;
        }
    }
} 