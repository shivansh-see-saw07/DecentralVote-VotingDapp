const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting, owner, addr1, addr2, addr3;

  beforeEach(async function () {
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    voting = await Voting.deploy();
    // await voting.deployed(); // Not needed in recent Hardhat/Ethers.js
  });

  it("Should create an election and set admin", async function () {
    await voting.createElection("Test Election");
    const election = await voting.elections(1);
    expect(election.name).to.equal("Test Election");
    expect(election.admin).to.equal(owner.address);
    expect(election.isActive).to.equal(true);
  });

  it("Should allow users to register as candidates", async function () {
    await voting.createElection("Election");
    await voting.connect(addr1).registerCandidate(1, "Alice");
    await voting.connect(addr2).registerCandidate(1, "Bob");
    const [addrs, names] = await voting.getCandidates(1);
    expect(addrs).to.include(addr1.address);
    expect(addrs).to.include(addr2.address);
    expect(names).to.include("Alice");
    expect(names).to.include("Bob");
  });

  it("Should allow users to vote and prevent double voting", async function () {
    await voting.createElection("Election");
    await voting.connect(addr1).registerCandidate(1, "Alice");
    await voting.connect(addr2).registerCandidate(1, "Bob");
    await voting.connect(addr3).vote(1, 0); // addr3 votes for Alice
    await expect(voting.connect(addr3).vote(1, 1)).to.be.revertedWith("Already voted");
  });

  it("Should only allow admin to view votes before result is declared", async function () {
    await voting.createElection("Election");
    await voting.connect(addr1).registerCandidate(1, "Alice");
    await voting.connect(addr2).registerCandidate(1, "Bob");
    await voting.connect(addr3).vote(1, 0);
    const votes = await voting.viewVotes(1);
    expect(votes[0]).to.equal(1);
    expect(votes[1]).to.equal(0);
    await expect(voting.connect(addr1).viewVotes(1)).to.be.revertedWith("Only admin can view votes");
  });

  it("Should allow only admin to declare result and then allow public to view results", async function () {
    await voting.createElection("Election");
    await voting.connect(addr1).registerCandidate(1, "Alice");
    await voting.connect(addr2).registerCandidate(1, "Bob");
    await voting.connect(addr3).vote(1, 0);
    await expect(voting.connect(addr1).declareResult(1)).to.be.revertedWith("Only admin can declare result");
    await voting.declareResult(1);
    const results = await voting.getResults(1);
    expect(results[0]).to.equal(1);
    expect(results[1]).to.equal(0);
    await expect(voting.viewVotes(1)).to.be.revertedWith("Result already declared");
  });
}); 