// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {GMLotto} from "../src/GMLotto.sol";

contract GMLottoTest is Test {
    GMLotto public lotto;
    address public user = address(1);
    uint256 public constant GM_FEE = 0.000029 ether;

    function setUp() public {
        lotto = new GMLotto();
        vm.deal(address(this), 1 ether);
        vm.deal(user, 1 ether);
    }

    function test_OnChainGM() public {
        lotto.onChainGM{value: GM_FEE}();
        assertEq(lotto.ticketCount(address(this)), 1);
    }

    function test_RevertIfInsufficientFee() public {
        vm.expectRevert("Incorrect ETH fee");
        lotto.onChainGM{value: 0.00001 ether}();
    }

    function test_RevertIfWithin24Hours() public {
        lotto.onChainGM{value: GM_FEE}();
        
        vm.expectRevert("Wait 24 hours");
        lotto.onChainGM{value: GM_FEE}();
    }

    function test_AllowAfter24Hours() public {
        lotto.onChainGM{value: GM_FEE}();
        assertEq(lotto.ticketCount(address(this)), 1);
        
        // Fast forward 24 hours + 1 second
        vm.warp(block.timestamp + 24 hours + 1);
        
        lotto.onChainGM{value: GM_FEE}();
        assertEq(lotto.ticketCount(address(this)), 2);
    }

    function test_TimeUntilNextGM() public {
        // Initially should be 0 for new user
        assertEq(lotto.timeUntilNextGM(address(this)), 0);
        
        // After GM, should be close to 24 hours
        lotto.onChainGM{value: GM_FEE}();
        
        // Let's say 1 hour passes
        vm.warp(block.timestamp + 1 hours);
        
        // Should be 23 hours left
        assertEq(lotto.timeUntilNextGM(address(this)), 23 hours);
        
        // Fast forward to after time limit
        vm.warp(block.timestamp + 23 hours + 1);
        
        // Should be 0 again
        assertEq(lotto.timeUntilNextGM(address(this)), 0);
    }

    function test_MultipleUsers() public {
        // First user GMs
        lotto.onChainGM{value: GM_FEE}();
        assertEq(lotto.ticketCount(address(this)), 1);
        
        // Second user GMs
        vm.prank(user);
        lotto.onChainGM{value: GM_FEE}();
        assertEq(lotto.ticketCount(user), 1);
        
        // Verify independent timers
        vm.warp(block.timestamp + 24 hours + 1);
        
        // First user GMs again
        lotto.onChainGM{value: GM_FEE}();
        assertEq(lotto.ticketCount(address(this)), 2);
        
        // Second user GMs again
        vm.prank(user);
        lotto.onChainGM{value: GM_FEE}();
        assertEq(lotto.ticketCount(user), 2);
    }
}
