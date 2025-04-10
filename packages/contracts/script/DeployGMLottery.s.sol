// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/GMLotteryManager.sol";
import "../src/GMLotteryToken.sol";

contract DeployGMLottery is Script {
    function run() external {
        // Get the private key and deployer address from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");
        address operator = vm.envAddress("OPERATOR_ADDRESS");
        uint256 roundDuration = 1 weeks;
        
        // Validate environment variables
        require(deployerPrivateKey != 0, "PRIVATE_KEY not set");
        require(deployer != address(0), "DEPLOYER_ADDRESS not set");
        require(operator != address(0), "OPERATOR_ADDRESS not set");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the NFT contract first
        GMLotteryToken nft = new GMLotteryToken();
        console2.log("GMLotteryToken deployed to:", address(nft));

        // Deploy the lottery manager contract with the NFT contract address
        GMLotteryManager lottery = new GMLotteryManager(operator, address(nft), roundDuration);
        console2.log("GMLotteryManager deployed to:", address(lottery));

        // Transfer ownership of the NFT contract to the lottery contract
        nft.transferOwnership(address(lottery));
        console2.log("NFT ownership transferred to lottery manager");

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Log verification commands
        console2.log("\nVerification commands:");
        console2.log("forge verify-contract", address(nft), "GMLotteryToken --chain optimism-sepolia");
        console2.log("forge verify-contract", address(lottery), "GMLotteryManager --chain optimism-sepolia");
        
        // Log important addresses
        console2.log("\nDeployment Summary:");
        console2.log("NFT Contract:", address(nft));
        console2.log("Lottery Manager:", address(lottery));
        console2.log("Operator:", operator);
        console2.log("Deployer:", deployer);
    }
} 