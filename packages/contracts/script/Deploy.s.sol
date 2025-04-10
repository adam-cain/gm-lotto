// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/GMLotteryToken.sol";
import "../src/GMLotteryManager.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy contracts
        GMLotteryToken ticketNFT = new GMLotteryToken();
        GMLotteryManager lotteryManager = new GMLotteryManager(
            msg.sender,
            address(ticketNFT),
            1 weeks
        );

        // Transfer ownership of NFT contract to lottery manager
        ticketNFT.transferOwnership(address(lotteryManager));

        vm.stopBroadcast();
    }
} 