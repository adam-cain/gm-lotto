// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/GMLotteryToken.sol";
import "../src/GMLotteryManager.sol";

contract GMLotteryTest is Test {
    GMLotteryToken public ticketNFT;
    GMLotteryManager public lotteryManager;
    address public feeRecipient = address(0x123);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public user3 = address(0x3);
    uint256 public constant ENTRY_AMOUNT = 0.1 ether;
    uint256 public constant INITIAL_TIMESTAMP = 1000000;

    event LotteryEntry(address indexed participant, uint256 roundNumber, uint256 ticketId);
    event RoundStarted(uint256 roundNumber, uint256 startTime);
    event RoundEnded(uint256 roundNumber, address winner, uint256 prize);

    function setUp() public {
        // Set initial timestamp
        vm.warp(INITIAL_TIMESTAMP);
        
        // Deploy contracts
        ticketNFT = new GMLotteryToken();
        lotteryManager = new GMLotteryManager(feeRecipient, address(ticketNFT));
        
        // Transfer ownership of NFT contract to lottery manager
        ticketNFT.transferOwnership(address(lotteryManager));
        
        // Fund test users
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(user3, 10 ether);
    }

    function test_InitialState() public {
        // Check initial state of lottery manager
        (uint256 roundNumber, uint256 startTime, uint256 endTime, uint256 prizePool, uint256 ticketCount, bool isActive) = 
            lotteryManager.getCurrentRoundInfo();
        
        assertEq(roundNumber, 1);
        assertEq(ticketCount, 0);
        assertEq(prizePool, 0);
        assertTrue(isActive);
        assertEq(endTime, startTime + 1 weeks);
        assertEq(startTime, INITIAL_TIMESTAMP);
        
        // Check NFT contract ownership
        assertEq(ticketNFT.owner(), address(lotteryManager));
    }

    function test_EnterLottery() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Check round info
        (,,,uint256 prizePool, uint256 ticketCount,) = lotteryManager.getCurrentRoundInfo();
        assertEq(prizePool, ENTRY_AMOUNT);
        assertEq(ticketCount, 1);

        // Check user's tickets
        uint256[] memory userTickets = ticketNFT.getUserTickets(user1);
        assertEq(userTickets.length, 1);
        assertEq(ticketNFT.getTicketRound(userTickets[0]), 1);
    }

    function test_24HourCooldown() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        
        // Try to enter again immediately
        vm.expectRevert("Must wait 24 hours between entries");
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        
        // Fast forward 23 hours
        vm.warp(block.timestamp + 23 hours);
        
        // Still can't enter
        vm.expectRevert("Must wait 24 hours between entries");
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        
        // Fast forward 1 more hour
        vm.warp(block.timestamp + 1 hours);
        
        // Now can enter
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();
    }

    function test_RoundEndAndWinnerSelection() public {
        // Multiple users enter lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        vm.startPrank(user2);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + 1 weeks);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User1 enters new round
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Check round info
        (uint256 roundNumber,,,,,) = lotteryManager.getCurrentRoundInfo();
        assertEq(roundNumber, 2);

        // Check previous round winner
        (,,,,bool isActive, address winner) = lotteryManager.getRoundInfo(1);
        assertFalse(isActive);
        assertTrue(winner == user1 || winner == user2);
    }

    function test_PrizeDistribution() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + 1 weeks);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // Get initial balances
        uint256 initialWinnerBalance = user1.balance;
        uint256 initialFeeRecipientBalance = feeRecipient.balance;

        // End round by entering new round
        vm.startPrank(user2);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Check prize distribution
        (,,,,,address winner) = lotteryManager.getRoundInfo(1);
        uint256 expectedPrize = (ENTRY_AMOUNT * 90) / 100; // 90% to winner
        uint256 expectedFee = ENTRY_AMOUNT - expectedPrize; // 10% to fee recipient

        if (winner == user1) {
            assertEq(user1.balance - initialWinnerBalance, expectedPrize);
        } else {
            assertEq(user2.balance - initialWinnerBalance, expectedPrize);
        }
        assertEq(feeRecipient.balance - initialFeeRecipientBalance, expectedFee);
    }

    function test_GetUserTicketsForRound() public {
        // User1 enters round 1
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Fast forward to round 2
        vm.warp(block.timestamp + 1 weeks);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User1 enters round 2
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Check tickets for each round
        uint256[] memory round1Tickets = ticketNFT.getUserTicketsForRound(user1, 1);
        uint256[] memory round2Tickets = ticketNFT.getUserTicketsForRound(user1, 2);

        assertEq(round1Tickets.length, 1);
        assertEq(round2Tickets.length, 1);
        assertEq(ticketNFT.getTicketRound(round1Tickets[0]), 1);
        assertEq(ticketNFT.getTicketRound(round2Tickets[0]), 2);
    }

    function test_ZeroValueEntry() public {
        vm.startPrank(user1);
        vm.expectRevert(); // Should revert with zero value
        lotteryManager.enterLottery{value: 0}();
        vm.stopPrank();
    }

    function test_InsufficientFunds() public {
        address poorUser = address(0x4);
        vm.deal(poorUser, 0.05 ether); // Give less than entry amount
        
        vm.startPrank(poorUser);
        vm.expectRevert("Entry amount too low");
        lotteryManager.enterLottery{value: 0.05 ether}();
        vm.stopPrank();
    }

    function test_MultipleUsersInSameRound() public {
        // User1 enters
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Wait 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User2 enters
        vm.startPrank(user2);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Wait 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User3 enters
        vm.startPrank(user3);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Check round info
        (,,,uint256 prizePool, uint256 ticketCount,) = lotteryManager.getCurrentRoundInfo();
        assertEq(ticketCount, 3);
        assertEq(prizePool, ENTRY_AMOUNT * 3);
    }

    function test_RoundTransitionTiming() public {
        // Enter first round
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Fast forward just before round end
        vm.warp(block.timestamp + 1 weeks - 1);
        
        // Check round hasn't ended
        (uint256 roundNumber,,,,,bool isActive) = lotteryManager.getCurrentRoundInfo();
        assertEq(roundNumber, 1);
        assertTrue(isActive);

        // Fast forward past round end
        vm.warp(block.timestamp + 2);

        // Enter new round to trigger transition
        vm.startPrank(user2);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Check round has transitioned
        (roundNumber,,,,,isActive) = lotteryManager.getCurrentRoundInfo();
        assertEq(roundNumber, 2);
        assertTrue(isActive);
    }

    function test_EmptyRoundTransition() public {
        // Fast forward to end of empty round
        vm.warp(block.timestamp + 1 weeks);

        // Enter new round to trigger transition
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Check round transitioned correctly
        (uint256 roundNumber,,,,,) = lotteryManager.getCurrentRoundInfo();
        assertEq(roundNumber, 2);

        // Check previous round has no winner
        (,,,,,address winner) = lotteryManager.getRoundInfo(1);
        assertEq(winner, address(0));
    }

    function test_NFTOwnershipAndTransfers() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Get user1's tickets
        uint256[] memory userTickets = ticketNFT.getUserTickets(user1);
        assertEq(userTickets.length, 1);
        uint256 ticketId = userTickets[0];

        // Check NFT ownership
        assertEq(ticketNFT.ownerOf(ticketId), user1);

        // Try transferring NFT
        vm.startPrank(user1);
        vm.expectRevert(); // Should not be able to transfer lottery ticket
        ticketNFT.transferFrom(user1, user2, ticketId);
        vm.stopPrank();
    }

    function test_EventEmission() public {
        vm.startPrank(user1);
        
        // Test LotteryEntry event
        vm.expectEmit(true, true, true, true);
        emit LotteryEntry(user1, 1, 0); // First ticket will have ID 0
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + 1 weeks + 24 hours);

        // Test RoundEnded event
        vm.startPrank(user2);
        vm.expectEmit(true, true, true, true);
        emit RoundEnded(1, user1, (ENTRY_AMOUNT * 90) / 100); // 90% to winner
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();
    }

    function test_ConsecutiveRoundParticipation() public {
        // Enter round 1
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Fast forward to just after round 1
        vm.warp(block.timestamp + 1 weeks + 24 hours);

        // Enter round 2
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Fast forward to just after round 2
        vm.warp(block.timestamp + 1 weeks + 24 hours);

        // Enter round 3
        vm.startPrank(user1);
        lotteryManager.enterLottery{value: ENTRY_AMOUNT}();
        vm.stopPrank();

        // Check ticket distribution across rounds
        uint256[] memory round1Tickets = ticketNFT.getUserTicketsForRound(user1, 1);
        uint256[] memory round2Tickets = ticketNFT.getUserTicketsForRound(user1, 2);
        uint256[] memory round3Tickets = ticketNFT.getUserTicketsForRound(user1, 3);

        assertEq(round1Tickets.length, 1);
        assertEq(round2Tickets.length, 1);
        assertEq(round3Tickets.length, 1);
    }

    function test_TimeUntilRoundEnd() public {
        // Check initial time until round end
        uint256 timeLeft = lotteryManager.timeUntilRoundEnd();
        assertEq(timeLeft, 1 weeks);

        // Fast forward half a week
        vm.warp(block.timestamp + 1 weeks / 2);
        
        // Check time again
        timeLeft = lotteryManager.timeUntilRoundEnd();
        assertEq(timeLeft, 1 weeks / 2);

        // Fast forward past end
        vm.warp(block.timestamp + 1 weeks);
        
        // Check time is zero
        timeLeft = lotteryManager.timeUntilRoundEnd();
        assertEq(timeLeft, 0);
    }
}