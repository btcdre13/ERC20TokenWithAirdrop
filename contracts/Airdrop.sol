// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Airdrop is ReentrancyGuard{
    address public owner;
    mapping (address => bool) public claimed;
    mapping (address => bool) public eligible; 
    address public tokenAddress;
    IERC20 public seaToken;
    uint256 public airdropAmount;
    
    
    

    constructor(address _tokenAddress, uint256 _airdropAmount)  {
        owner = msg.sender;
        seaToken = IERC20(_tokenAddress); 
        airdropAmount = _airdropAmount;
    }

     function setEligible(address[] calldata addresses) public onlyOwner {
        for(uint i = 0; i < addresses.length; i++){
            eligible[addresses[i]] = true;
        }
    }    

    function addEligible(address _user) public onlyOwner {
        eligible[_user] = true;
    }

    function changeEligible(address[] calldata addresses) public onlyOwner {
        for(uint i = 0; i < addresses.length; i++){
            eligible[addresses[i]] = false;
        }
    }

    function removeEligible(address _user) public onlyOwner {
        eligible[_user] = false;
    }


    function claim() public nonReentrant {
        require(eligible[msg.sender], "You are not eligible to claim this airdrop");
        require(!claimed[msg.sender], "You have already claimed your airdrop");
        require(seaToken.transfer(msg.sender, airdropAmount), "Airdrop failed"); 
        claimed[msg.sender] = true;
    }

     

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
}