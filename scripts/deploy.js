const hre = require("hardhat");
async function main() {
  const SeaToken = await hre.ethers.getContractFactory("SeaToken");
  const seatoken = await SeaToken.deploy();

  await seatoken.deployed();

  console.log(`SeaToken Contract deployed at address: ${seatoken.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
