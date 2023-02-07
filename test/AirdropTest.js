const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Airdrop contract", function () {
  // global vars
  let Airdrop;
  let airdrop;
  let owner;
  let addr1;
  let addr2;
  let SeaToken;
  let seatoken;
  let seaOwner;

  
  beforeEach(async function() {
    // Get TokenFactory and Signers
    

    SeaToken = await ethers.getContractFactory("SeaToken");
    [seaOwner] = await hre.ethers.getSigners();

    seatoken = await SeaToken.deploy();

    Airdrop = await ethers.getContractFactory("Airdrop");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    airdrop = await Airdrop.deploy(seatoken.address, 1);

    await seatoken.transfer(airdrop.address, 1000);


  });

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      expect(await airdrop.owner()).to.equal(owner.address);
    });

    it("should set the right owner for the TokenContract", async function () {
      expect(await seatoken.owner()).to.equal(seaOwner.address);
    });  
  });

  describe("Airdrop", function () {
    it("should accept SeaTokens from the TokenContract", async function () {
      expect(await seatoken.balanceOf(airdrop.address)).to.equal(1000);
    });

    it("should let the owner add multiple addresses at once", async function() {
      await airdrop.setEligible([addr1.address, addr2.address]);
      expect(await airdrop.connect(addr1).claim()).to.be.ok;
      expect(await airdrop.connect(addr2).claim()).to.be.ok;
      expect(await seatoken.balanceOf(addr1.address)).to.equal(1);
      expect(await seatoken.balanceOf(addr2.address)).to.equal(1);
    });

    it("should let the owner remove multiple addresses at once", async function (){
      await airdrop.setEligible([addr1.address, addr2.address]);
      await airdrop.changeEligible([addr1.address, addr2.address]);
      await expect(airdrop.connect(addr1).claim()).to.be.revertedWith("You are not eligible to claim this airdrop");
      await expect(airdrop.connect(addr2).claim()).to.be.revertedWith("You are not eligible to claim this airdrop");
    })

    it("should let the owner remove an addresses from the eligible list", async function(){
      await airdrop.addEligible(addr1.address);
      await airdrop.removeEligible(addr1.address);
      await expect(airdrop.connect(addr1).claim()).to.be.revertedWith("You are not eligible to claim this airdrop");
    });

    it("should let eligible wallets claim the airdrop", async function(){
      await airdrop.addEligible(addr1.address);
      expect(await airdrop.connect(addr1).claim()).to.be.ok;
    });

    it("should transfer the tokens to the wallet after claiming", async function(){
      await airdrop.addEligible(addr1.address);
      await airdrop.connect(addr1).claim();
      expect(await seatoken.balanceOf(addr1.address)).to.equal(1);
    })

    it("should fail if a user tries to claim the airdrop twice", async function(){
      await airdrop.addEligible(addr1.address);
      expect(await seatoken.balanceOf(addr1.address)).to.equal(0);
      expect(await airdrop.connect(addr1).claim()).to.be.ok;
      await expect(airdrop.connect(addr1).claim()).to.be.revertedWith("You have already claimed your airdrop");
    });

    it("should deny uneligible users the airdrop", async function (){
      await expect(airdrop.connect(addr2).claim()).to.be.revertedWith("You are not eligible to claim this airdrop");
    });

    
  })
})