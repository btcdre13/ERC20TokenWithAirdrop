const hre = require("hardhat");
async function main() {
    const Airdrop = await hre.ethers.getContractFactory("Airdrop");
    const tokenAddress = "0xd4fB30AacBCa3B26b9c7DEDB7e3a70b79Bcb1b1b";
    const airdropAmount = ethers.utils.parseUnits("1000", "ether");
    const airdrop = await Airdrop.deploy(tokenAddress, airdropAmount);

    await airdrop.deployed();

    console.log(`Airdrop contract deployed at address ${airdrop.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});