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
    // Events
    event LotteryEntry(address indexed participant, uint256 roundNumber, uint256 ticketId);
    event RoundStarted(uint256 roundNumber, uint256 startTime);
    event RoundEnded(uint256 roundNumber, address winner, uint256 winningTicketId);
    event PrizeSet(uint256 roundNumber, uint256 amount);
    event PrizeClaimed(uint256 roundNumber, address winner, uint256 amount);
    event ContractPaused();
    event ContractUnpaused();
    event EmergencyWithdrawal(address indexed operator, uint256 amount);
    
    // Custom errors
    error ContractIsPaused();
    error OnlyOperator();
    error WaitPeriodNotOver();
    error RoundNotActive();
    error NoActiveRound();
    error IncorrectAmount();
    error PrizeAmountTooLow();
    error NotWinner();
    error PrizeNotSet();
    error PrizeAlreadyClaimed();
    error PrizeTransferFailed();
    error NoFundsToWithdraw();
    error MustBePaused();
    error WithdrawalFailed();

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
        (
            uint256 roundNumber,
            uint256 startTime,
            uint256 roundTicketCount,
            uint256 userRoundTicketCount,
            GMLotteryManager.PrevRound[] memory pastRounds
        ) = lotteryManager.getCurrentRoundInfo();
        
        assertEq(roundNumber, 1);
        assertEq(roundTicketCount, 0);
        assertEq(userRoundTicketCount, 0);
        assertEq(pastRounds.length, 0); // Initially no past rounds
        assertEq(startTime, INITIAL_TIMESTAMP);
        
        // Check NFT contract ownership
        assertEq(ticketNFT.owner(), address(lotteryManager));
        
        // Verify that next token ID starts from 1
        assertEq(ticketNFT.totalSupply(), 0); // No tokens yet, so totalSupply is 0
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

        // Check user's ticket count for round
        uint256 userTicketsForRound = ticketNFT.getUserTicketCountForRound(user1, 1);
        assertEq(userTicketsForRound, 1);
        
        // Check first token ID of round
        assertEq(ticketNFT.getFirstTokenIdOfRound(1), 1);
    }

    function test_24HourCooldown() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        
        // Try to enter again immediately
        vm.expectRevert(WaitPeriodNotOver.selector);
        lotteryManager.enterLottery();
        
        // Fast forward 23 hours
        vm.warp(block.timestamp + 23 hours);
        
        // Still can't enter
        vm.expectRevert(WaitPeriodNotOver.selector);
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

        // Operator ends current round and starts a new one
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

        // Check round number
        (uint256 roundNumber,,,,) = lotteryManager.getCurrentRoundInfo();
        assertEq(roundNumber, 2);

        // Check previous round winner
        (,,,bool isActive, address winner, uint256 prizeAmount,,, uint256 winningTicketId,) = lotteryManager.getRoundInfo(1);
        assertFalse(isActive);
        assertTrue(winner == user1 || winner == user2);
        assertEq(prizeAmount, PRIZE_AMOUNT);
        
        // Check winning ticket ID is valid (should be either 1 or 2)
        assertTrue(winningTicketId >= 1 && winningTicketId <= 2);
    }

    function test_PrizeClaimingAfterRoundEnd() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Get initial balances
        uint256 initialOperatorBalance = operator.balance;

        // Operator ends round, sets prize, and starts new round
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

        // Get winner info
        (,,,, address winner, uint256 prizeAmount,,,uint256 winningTicketId,) = lotteryManager.getRoundInfo(1);

        // Check prize is set
        assertEq(prizeAmount, PRIZE_AMOUNT);
        assertEq(winner, user1); // Only one participant, so user1 is winner
        assertEq(winningTicketId, 1); // Should be the first ticket

        // Get winner's initial balance
        uint256 initialWinnerBalance = winner.balance;

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

        // Operator ends round 1 and starts round 2
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

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
        
        // Check first token IDs for both rounds
        assertEq(ticketNFT.getFirstTokenIdOfRound(1), 1);
        assertEq(ticketNFT.getFirstTokenIdOfRound(2), 2);
    }

    function test_TokenIdRange() public {
        // User1 enters lottery for round 1
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();
        
        // User2 enters lottery for round 1
        vm.startPrank(user2);
        vm.warp(block.timestamp + 24 hours); // Move forward to allow entry
        lotteryManager.enterLottery();
        vm.stopPrank();
        
        // Verify token ID range for round 1
        (uint256 startId, uint256 endId) = ticketNFT.getRoundTokenIdRange(1);
        assertEq(startId, 1);
        assertEq(endId, 2);
        
        // Operator ends round 1 and starts round 2
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();
        
        // User1 enters lottery for round 2
        vm.startPrank(user1);
        vm.warp(block.timestamp + 24 hours); // Move forward to allow entry
        lotteryManager.enterLottery();
        vm.stopPrank();
        
        // Verify token ID range for round 2
        (startId, endId) = ticketNFT.getRoundTokenIdRange(2);
        assertEq(startId, 3);
        assertEq(endId, 3);
    }

    function test_ManuallyStartNewRound() public pure {
        // Removed as startNewRound function was removed
        assertTrue(true);
    }

    function test_OnlyOperatorCanEndRound() public {
        // User1 tries to end round
        vm.startPrank(user1);
        vm.expectRevert(OnlyOperator.selector);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

        // Operator can end round
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();
    }

    function test_CannotClaimPrizeBeforeRoundEnds() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        
        // Try to claim prize before round ends
        vm.expectRevert(); // Will revert because user1 is not the winner yet
        lotteryManager.claimPrize(1);
        vm.stopPrank();
    }

    function test_CannotClaimPrizeTwice() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Operator ends round
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

        // Get winner
        (,,,, address winner,,, bool prizeClaimed,,) = lotteryManager.getRoundInfo(1);
        assertFalse(prizeClaimed);

        // Claim prize first time
        vm.startPrank(winner);
        lotteryManager.claimPrize(1);
        
        // Try to claim again
        vm.expectRevert(PrizeAlreadyClaimed.selector);
        lotteryManager.claimPrize(1);
        vm.stopPrank();
    }

    function test_GetTotalTicketCount() public {
        // Check initial count
        assertEq(ticketNFT.totalSupply(), 0);

        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check count after first entry
        assertEq(ticketNFT.totalSupply(), 1);

        // Fast forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // User2 enters lottery
        vm.startPrank(user2);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Check count after second entry
        assertEq(ticketNFT.totalSupply(), 2);
    }

    function test_GetPastRounds() public {
        // Initially no past rounds
        (,,,,GMLotteryManager.PrevRound[] memory pastRounds) = lotteryManager.getCurrentRoundInfo();
        assertEq(pastRounds.length, 0);

        // Operator ends round and starts new round
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

        // Check past rounds
        (,,,,pastRounds) = lotteryManager.getCurrentRoundInfo();
        assertEq(pastRounds.length, 1);
        assertEq(pastRounds[0].roundNumber, 1);
        assertEq(pastRounds[0].startTime, INITIAL_TIMESTAMP);
        assertFalse(pastRounds[0].isActive);
    }

    function test_CannotTransferTicket() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Get the token ID
        uint256 tokenId = 1; // First token ID

        // Try to transfer ticket
        vm.startPrank(user1);
        vm.expectRevert(); // Should revert on transfer attempt
        ticketNFT.transferFrom(user1, user2, tokenId);
        vm.stopPrank();
    }

    function test_TicketData() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Verify ticket owner and round number via getRoundInfo
        uint256 tokenId = 1; // First token ID
        assertEq(ticketNFT.ownerOf(tokenId), user1);
        
        // Use getRoundTokenIdRange to verify this ticket belongs to round 1
        (uint256 startId, uint256 endId) = ticketNFT.getRoundTokenIdRange(1);
        assertTrue(tokenId >= startId && tokenId <= endId);
    }

    function test_RoundTicketCountEdgeCases() public view {
        // Check count for non-existent round
        assertEq(ticketNFT.getRoundTicketCount(999), 0);
        
        // Check count for round with no tickets
        assertEq(ticketNFT.getRoundTicketCount(1), 0);
        
        // First token ID for non-existent round should be 0
        assertEq(ticketNFT.getFirstTokenIdOfRound(999), 0);
    }

    function test_ContractPauseUnpause() public {
        // Only operator can pause
        vm.startPrank(user1);
        vm.expectRevert(OnlyOperator.selector);
        lotteryManager.pause();
        vm.stopPrank();

        // Operator can pause
        vm.startPrank(operator);
        lotteryManager.pause();
        vm.stopPrank();

        // Cannot enter lottery when paused
        vm.startPrank(user1);
        vm.expectRevert(ContractIsPaused.selector);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Only operator can unpause
        vm.startPrank(user1);
        vm.expectRevert(OnlyOperator.selector);
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

        // Operator ends round
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

        // Only operator can withdraw
        vm.startPrank(user1);
        vm.expectRevert(OnlyOperator.selector);
        lotteryManager.emergencyWithdraw();
        vm.stopPrank();

        // Contract must be paused
        vm.startPrank(operator);
        vm.expectRevert(MustBePaused.selector);
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
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

        // Verify round 1 has no winner
        (,,,, address winner,,,, uint256 winningTicketId, uint256 firstTokenId) = lotteryManager.getRoundInfo(1);
        assertEq(winner, address(0));
        assertEq(winningTicketId, 0); // No winning ticket
        assertEq(firstTokenId, 0); // No tickets minted
    }

    function test_PrizeClaimingEdgeCases() public {
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();

        // Operator ends round
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();

        // Non-winner cannot claim prize
        vm.startPrank(user3);
        vm.expectRevert(NotWinner.selector);
        lotteryManager.claimPrize(1);
        vm.stopPrank();
    }

    function test_RoundHasTickets() public {
        // No tickets initially
        uint256 ticketCount = ticketNFT.getRoundTicketCount(1);
        assertEq(ticketCount, 0);
        
        // User1 enters lottery
        vm.startPrank(user1);
        lotteryManager.enterLottery();
        vm.stopPrank();
        
        // Should have tickets now
        ticketCount = ticketNFT.getRoundTicketCount(1);
        assertEq(ticketCount, 1);
        
        // First token ID should be 1
        assertEq(ticketNFT.getFirstTokenIdOfRound(1), 1);
    }

    function test_GetLastParticipation() public {
        // Initially there should be no participation record
        assertEq(lotteryManager.getLastParticipation(user1), 0);
        
        // User1 enters lottery
        vm.startPrank(user1);
        uint64 timestamp = lotteryManager.enterLottery();
        vm.stopPrank();
        
        // Check that last participation timestamp is recorded for current round
        assertEq(lotteryManager.getLastParticipation(user1), timestamp);
        
        // Start new round
        vm.startPrank(operator);
        lotteryManager.endCurrentRound{value: PRIZE_AMOUNT}();
        vm.stopPrank();
        
        // User1 enters new round
        vm.warp(block.timestamp + 24 hours);
        vm.startPrank(user1);
        uint64 timestamp2 = lotteryManager.enterLottery();
        vm.stopPrank();
        
        // Check participation in current round (now round 2)
        assertEq(lotteryManager.getLastParticipation(user1), timestamp2);
    }
} 