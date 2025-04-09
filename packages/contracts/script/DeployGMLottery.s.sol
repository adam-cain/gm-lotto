// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/GMLotteryInterval.sol";

contract DeployGMLottery is Script {
    function run() external {
        // Get the private key from the environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the GMLotto contract
        GMLotto lottery = new GMLotto(deployer);

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Log the deployment details
        console2.log("GMLotto deployed to:", address(lottery));
        console2.log("Verify contract with:");
        console2.log("forge verify-contract", address(lottery), "GMLotto --chain optimism-sepolia");
    }
} 