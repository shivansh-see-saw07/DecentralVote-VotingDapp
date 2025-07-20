const { ethers } = require("hardhat");

async function main() {
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment(); // Ensures deployment is complete
  const address = await voting.getAddress();
  console.log("Voting contract deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 