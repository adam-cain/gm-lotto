// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/GMLotteryToken.sol";
import "../src/GMLotteryManager.sol";

contract GMLotteryTest is Test {
    GMLotteryToken public ticketNFT;
    GMLotteryManager public lotteryManager;
    address public operator = address(0x123);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public user3 = address(0x3);
    uint256 public constant INITIAL_TIMESTAMP = 1000000;
    uint256 public constant PRIZE_AMOUNT = 1 ether;
    uint256 public constant ROUND_DURATION = 1 weeks;

    event LotteryEntry(address indexed participant, uint256 roundNumber, uint256 ticketId);
    event RoundStarted(uint256 roundNumber, uint256 startTime);
    event RoundEnded(uint256 roundNumber, address winner);
    event PrizeSet(uint256 roundNumber, uint256 amount);
    event PrizeClaimed(uint256 roundNumber, address winner, uint256 amount);

    function setUp() public {
        // Set initial timestamp
        vm.warp(INITIAL_TIMESTAMP);
        
        // Deploy contracts
        ticketNFT = new GMLotteryToken();
        lotteryManager = new GMLotteryManager(operator, address(ticketNFT), ROUND_DURATION);
        
        // Transfer ownership of NFT contract to lottery manager
        ticketNFT.transferOwnership(address(lotteryManager));
        
        // Fund test users
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(user3, 10 ether);
        vm.deal(operator, 10 ether);
    }

    function test_InitialState() public view {
        // Check initial state of lottery manager
        (
            uint256 roundNumber,
            uint256 endTime,
            uint256 roundTicketCount,
            uint256 userRoundTicketCount,
            uint256[] memory pastRounds
        ) = lotteryManager.getCurrentRoundInfo();
        
        assertEq(roundNumber, 1);
        assertEq(roundTicketCount, 0);
        assertEq(userRoundTicketCount, 0);
        assertEq(pastRounds.length, 1);
        assertEq(pastRounds[0], 1);
        assertEq(endTime, INITIAL_TIMESTAMP + ROUND_DURATION);
        
        // Check NFT contract ownership
        assertEq(ticketNFT.owner(), address(lotteryManager));
    }

    function test_EnterLottery() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check round info
        vm.prank(user1);
        (,,uint256 roundTicketCount, uint256 userRoundTicketCount,) = lotteryManager.getCurrentRoundInfo();
        assertEq(roundTicketCount, 1);
        assertEq(userRoundTicketCount, 1);

        // Check user's tickets
        uint256[] memory userTickets = ticketNFT.getUserTickets(user1);
        assertEq(userTickets.length, 1);
        assertEq(ticketNFT.getTicketRound(userTickets[0]), 1);
    }

    function test_24HourCooldown() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        
        // Try to enter again immediately
        vm.expectRevert("Must wait 24 hours between entries");
        lotteryManager.enterLottery();
        
        // Fast forward 23 hours
        vm.warp(block.timestamp + 23 hours);
        
        // Still can't enter
        vm.expectRevert("Must wait 24 hours between entries");
        lotteryManager.enterLottery();
        
        // Fast forward 1 more hour
        vm.warp(block.timestamp + 1 hours);
        
        // Now can enter
        lotteryManager.enterLottery();
        vm.stopPrank();
    }

    function test_RoundEndAndWinnerSelection() public {
        // Multiple users enter lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User1 enters new round
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check round info
        (uint256 roundNumber,,,,) = lotteryManager.getCurrentRoundInfo();
        assertEq(roundNumber, 2);

        // Set prize for round 1
        vm.startPrank(operator);
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();

        // Check previous round winner
        uint256 startTime;
        uint256 endTime;
        uint256 roundTicketCount;
        uint256 userRoundTicketCount;
        bool isActive;
        address winner;
        uint256 prizeAmount;
        bool prizeSet;
        bool prizeClaimed;
        (
            startTime,
            endTime,
            roundTicketCount,
            userRoundTicketCount,
            isActive,
            winner,
            prizeAmount,
            prizeSet,
            prizeClaimed
        ) = lotteryManager.getRoundInfo(1);
        assertTrue(winner == user1 || winner == user2);

        // Check prize is set
        assertEq(prizeAmount, PRIZE_AMOUNT);
        assertTrue(prizeSet);
    }

    function test_PrizeSettingAndClaiming() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Start new round to end current round
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Get initial balances
        uint256 initialWinnerBalance = user1.balance;
        uint256 initialOperatorBalance = operator.balance;

        // Set prize amount as operator
        vm.startPrank(operator);
        vm.expectEmit(true, true, true, true);
        emit PrizeSet(1, PRIZE_AMOUNT);
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();

        // Get winner info
        uint256 startTime;
        uint256 endTime;
        uint256 roundTicketCount;
        uint256 userRoundTicketCount;
        bool isActive;
        address winner;
        uint256 prizeAmount;
        bool prizeSet;
        bool prizeClaimed;
        (
            startTime,
            endTime,
            roundTicketCount,
            userRoundTicketCount,
            isActive,
            winner,
            prizeAmount,
            prizeSet,
            prizeClaimed
        ) = lotteryManager.getRoundInfo(1);

        // Check prize is set
        assertEq(prizeAmount, PRIZE_AMOUNT);
        assertTrue(prizeSet);

        // Claim prize as winner
        vm.startPrank(winner);
        vm.expectEmit(true, true, true, true);
        emit PrizeClaimed(1, winner, PRIZE_AMOUNT);
        lotteryManager.claimPrize(1);
        vm.stopPrank();

        // Check balances
        assertEq(winner.balance - initialWinnerBalance, PRIZE_AMOUNT);
        assertEq(operator.balance, initialOperatorBalance - PRIZE_AMOUNT);
    }

    function test_GetUserTicketsForRound() public {
        // User1 enters round 1
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to round 2
        vm.warp(block.timestamp + ROUND_DURATION);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User1 enters round 2
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check tickets for each round
        uint256 round1Count = ticketNFT.getUserTicketCountForRound(user1, 1);
        uint256 round2Count = ticketNFT.getUserTicketCountForRound(user1, 2);

        assertEq(round1Count, 1);
        assertEq(round2Count, 1);
    }

    function test_OnlyOperatorCanSetPrize() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Try to set prize as non-operator
        vm.startPrank(user1);
        vm.expectRevert("Only operator can set prize");
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();
    }

    function test_CannotSetPrizeForActiveRound() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Try to set prize while round is active
        vm.startPrank(operator);
        vm.expectRevert("Round still active");
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();
    }

    function test_CannotSetPrizeTwice() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Start new round to end current round
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Set prize first time
        vm.startPrank(operator);
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        
        // Try to set prize again
        vm.expectRevert("Prize already set");
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();
    }

    function test_CannotClaimPrizeBeforeSet() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Start new round to end current round
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Try to claim prize before it's set
        uint256 startTime;
        uint256 endTime;
        uint256 roundTicketCount;
        uint256 userRoundTicketCount;
        bool isActive;
        address winner;
        uint256 prizeAmount;
        bool prizeSet;
        bool prizeClaimed;
        (
            startTime,
            endTime,
            roundTicketCount,
            userRoundTicketCount,
            isActive,
            winner,
            prizeAmount,
            prizeSet,
            prizeClaimed
        ) = lotteryManager.getRoundInfo(1);
        vm.startPrank(winner);
        vm.expectRevert("Prize not set");
        lotteryManager.claimPrize(1);
        vm.stopPrank();
    }

    function test_CannotClaimPrizeTwice() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Start new round to end current round
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Set prize
        vm.startPrank(operator);
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();

        // Get winner
        address winner;
        (,,,,,winner,,,) = lotteryManager.getRoundInfo(1);

        // Claim prize first time
        vm.startPrank(winner);
        lotteryManager.claimPrize(1);
        
        // Try to claim again
        vm.expectRevert("Prize already claimed");
        lotteryManager.claimPrize(1);
        vm.stopPrank();
    }

    function test_TimeUntilRoundEnd() public {
        // Check initial time until round end
        uint256 timeLeft = lotteryManager.timeUntilRoundEnd();
        assertEq(timeLeft, ROUND_DURATION);

        // Fast forward half a week
        vm.warp(block.timestamp + ROUND_DURATION / 2);
        
        // Check time again
        timeLeft = lotteryManager.timeUntilRoundEnd();
        assertEq(timeLeft, ROUND_DURATION / 2);

        // Fast forward past end
        vm.warp(block.timestamp + ROUND_DURATION);
        
        // Check time is zero
        timeLeft = lotteryManager.timeUntilRoundEnd();
        assertEq(timeLeft, 0);
    }

    function test_GetTotalTicketCount() public {
        // Check initial count
        assertEq(ticketNFT.getTotalTicketCount(), 0);

        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check count after first entry
        assertEq(ticketNFT.getTotalTicketCount(), 1);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User2 enters lottery
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check count after second entry
        assertEq(ticketNFT.getTotalTicketCount(), 2);
    }

    function test_GetPastRounds() public {
        // Initially only round 1
        (,,,,uint256[] memory pastRounds) = lotteryManager.getCurrentRoundInfo();
        assertEq(pastRounds.length, 1);
        assertEq(pastRounds[0], 1);

        // Fast forward to round 2
        vm.warp(block.timestamp + ROUND_DURATION);
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check past rounds
        (,,,,pastRounds) = lotteryManager.getCurrentRoundInfo();
        assertEq(pastRounds.length, 2);
        assertEq(pastRounds[0], 1);
        assertEq(pastRounds[1], 2);
    }

    function test_CannotTransferTicket() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Try to transfer ticket
        uint256[] memory tickets = ticketNFT.getUserTickets(user1);
        vm.startPrank(user1);
        vm.expectRevert(); // Should revert on transfer attempt
        ticketNFT.transferFrom(user1, user2, tickets[0]);
        vm.stopPrank();
    }

    function test_TicketData() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Verify ticket data
        uint256[] memory tickets = ticketNFT.getUserTickets(user1);
        assertEq(ticketNFT.getTicketRound(tickets[0]), 1);
        assertEq(ticketNFT.ownerOf(tickets[0]), user1);
    }

    function test_RoundTicketCountEdgeCases() public view {
        // Check count for non-existent round
        assertEq(ticketNFT.getRoundTicketCount(999), 0);
        
        // Check count for round with no tickets
        assertEq(ticketNFT.getRoundTicketCount(1), 0);
    }

    function test_ContractPauseUnpause() public {
        // Only operator can pause
        vm.startPrank(user1);
        vm.expectRevert("Only operator can pause");
        lotteryManager.pause();
        vm.stopPrank();

        // Operator can pause
        vm.startPrank(operator);
        lotteryManager.pause();
        vm.stopPrank();

        // Cannot enter lottery when paused
        vm.startPrank(user1);
        vm.expectRevert("Contract is paused");
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Only operator can unpause
        vm.startPrank(user1);
        vm.expectRevert("Only operator can unpause");
        lotteryManager.unpause();
        vm.stopPrank();

        // Operator can unpause
        vm.startPrank(operator);
        lotteryManager.unpause();
        vm.stopPrank();
    }

    function test_EmergencyWithdrawal() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Start new round to end current round
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Set prize for round 1
        vm.startPrank(operator);
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();

        // Only operator can withdraw
        vm.startPrank(user1);
        vm.expectRevert("Only operator can withdraw");
        lotteryManager.emergencyWithdraw();
        vm.stopPrank();

        // Contract must be paused
        vm.startPrank(operator);
        vm.expectRevert("Contract must be paused");
        lotteryManager.emergencyWithdraw();
        vm.stopPrank();

        // Pause and withdraw
        vm.startPrank(operator);
        lotteryManager.pause();
        uint256 initialBalance = operator.balance;
        lotteryManager.emergencyWithdraw();
        assertEq(operator.balance - initialBalance, PRIZE_AMOUNT);
        vm.stopPrank();
    }

    function test_RoundEndEdgeCases() public {
        // End round with no participants
        vm.warp(block.timestamp + ROUND_DURATION);
        vm.startPrank(user1);
        lotteryManager.enterLottery(); // This should end round 1 and start round 2
        vm.stopPrank();

        // Verify round 1 has no winner
        uint256 startTime;
        uint256 endTime;
        uint256 roundTicketCount;
        uint256 userRoundTicketCount;
        bool isActive;
        address winner;
        uint256 prizeAmount;
        bool prizeSet;
        bool prizeClaimed;
        (
            startTime,
            endTime,
            roundTicketCount,
            userRoundTicketCount,
            isActive,
            winner,
            prizeAmount,
            prizeSet,
            prizeClaimed
        ) = lotteryManager.getRoundInfo(1);
        assertEq(winner, address(0));
    }

    function test_PrizeClaimingEdgeCases() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + ROUND_DURATION);

        // Start new round to end current round
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Set prize
        vm.startPrank(operator);
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();

        // Get winner
        uint256 startTime;
        uint256 endTime;
        uint256 roundTicketCount;
        uint256 userRoundTicketCount;
        bool isActive;
        address winner;
        uint256 prizeAmount;
        bool prizeSet;
        bool prizeClaimed;
        (
            startTime,
            endTime,
            roundTicketCount,
            userRoundTicketCount,
            isActive,
            winner,
            prizeAmount,
            prizeSet,
            prizeClaimed
        ) = lotteryManager.getRoundInfo(1);

        // Non-winner cannot claim prize
        vm.startPrank(user3);
        vm.expectRevert("Not the winner");
        lotteryManager.claimPrize(1);
        vm.stopPrank();
    }

    function test_RoundDurationValidation() public {
        // Try to create manager with zero duration
        vm.expectRevert("Round duration must be greater than 0");
        new GMLotteryManager(operator, address(ticketNFT), 0);
    }
} 