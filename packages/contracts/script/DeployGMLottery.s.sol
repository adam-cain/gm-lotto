// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/GMLotteryInterval.sol";
import "../src/GMLottoNFT.sol";

contract DeployGMLottery is Script {
    function run() external {
        // Get the private key from the environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the NFT contract first
        GMLottoNFT nft = new GMLottoNFT();

        // Deploy the GMLotto contract with the NFT contract address
        GMLotto lottery = new GMLotto(deployer, address(nft));

        // Transfer ownership of the NFT contract to the lottery contract
        nft.transferOwnership(address(lottery));

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Log the deployment details
        console2.log("GMLottoNFT deployed to:", address(nft));
        console2.log("GMLotto deployed to:", address(lottery));
        console2.log("Verify NFT contract with:");
        console2.log("forge verify-contract", address(nft), "GMLottoNFT --chain optimism-sepolia");
        console2.log("Verify lottery contract with:");
        console2.log("forge verify-contract", address(lottery), "GMLotto --chain optimism-sepolia");
    }
} 