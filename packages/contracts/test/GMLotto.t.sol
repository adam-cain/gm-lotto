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
        lotteryManager = new GMLotteryManager(operator, address(ticketNFT));
        
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
        (uint256 roundNumber, uint256 startTime, uint256 endTime, uint256 ticketCount, bool isActive) = 
            lotteryManager.getCurrentRoundInfo();
        
        assertEq(roundNumber, 1);
        assertEq(ticketCount, 0);
        assertTrue(isActive);
        assertEq(endTime, startTime + 1 weeks);
        assertEq(startTime, INITIAL_TIMESTAMP);
        
        // Check NFT contract ownership
        assertEq(ticketNFT.owner(), address(lotteryManager));
    }

    function test_EnterLottery() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check round info
        (,,,uint256 ticketCount,) = lotteryManager.getCurrentRoundInfo();
        assertEq(ticketCount, 1);

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
        vm.warp(block.timestamp + 1 weeks);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User1 enters new round
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check round info
        (uint256 roundNumber,,,,) = lotteryManager.getCurrentRoundInfo();
        assertEq(roundNumber, 2);

        // Check previous round winner
        (,,,,address winner,,,) = lotteryManager.getRoundInfo(1);
        assertTrue(winner == user1 || winner == user2);
    }

    function test_PrizeSettingAndClaiming() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + 1 weeks);

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

        // Check prize is set
        (,,,,address winner, uint256 prizeAmount, bool prizeSet,) = lotteryManager.getRoundInfo(1);
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
        vm.warp(block.timestamp + 1 weeks);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User1 enters round 2
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check tickets for each round
        uint256[] memory round1Tickets = ticketNFT.getUserTicketsForRound(user1, 1);
        uint256[] memory round2Tickets = ticketNFT.getUserTicketsForRound(user1, 2);

        assertEq(round1Tickets.length, 1);
        assertEq(round2Tickets.length, 1);
        assertEq(ticketNFT.getTicketRound(round1Tickets[0]), 1);
        assertEq(ticketNFT.getTicketRound(round2Tickets[0]), 2);
    }

    function test_OnlyOperatorCanSetPrize() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Fast forward to end of round
        vm.warp(block.timestamp + 1 weeks);

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
        vm.warp(block.timestamp + 1 weeks);

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
        vm.warp(block.timestamp + 1 weeks);

        // Start new round to end current round
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Try to claim prize before it's set
        (,,,,address winner,,,) = lotteryManager.getRoundInfo(1);
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
        vm.warp(block.timestamp + 1 weeks);

        // Start new round to end current round
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Set prize
        vm.startPrank(operator);
        lotteryManager.setPrizeAmount{value: PRIZE_AMOUNT}(1, PRIZE_AMOUNT);
        vm.stopPrank();

        // Get winner
        (,,,,address winner,,,) = lotteryManager.getRoundInfo(1);

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