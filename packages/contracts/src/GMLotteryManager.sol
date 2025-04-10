// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./GMLotteryToken.sol";

contract GMLotteryManager {
    // Immutable variables
    address public immutable feeRecipient;
    GMLotteryToken public immutable ticketNFT;
    uint256 public constant ROUND_DURATION = 1 weeks;
    uint256 public constant WINNER_PERCENTAGE = 90; // 90% of pool goes to winner
    uint256 public constant FEE_PERCENTAGE = 10; // 10% goes to fee recipient

    // Lottery round tracking
    struct Round {
        uint256 startTime;
        uint256 endTime;
        uint256 prizePool;
        uint256[] ticketIds;
        bool isActive;
        address winner;
    }

    // Current round number and rounds mapping
    uint256 public currentRound;
    mapping(uint256 => Round) public rounds;
    
    // User's last participation timestamp
    mapping(address => uint256) public lastParticipationTimestamp;
    
    // Events
    event LotteryEntry(address indexed participant, uint256 roundNumber, uint256 ticketId);
    event RoundStarted(uint256 roundNumber, uint256 startTime);
    event RoundEnded(uint256 roundNumber, address winner, uint256 prize);
    
    constructor(address _feeRecipient, address _ticketNFT) {
        feeRecipient = _feeRecipient;
        ticketNFT = GMLotteryToken(_ticketNFT);
        _startNewRound();
    }
    
    function enterLottery() external payable {
        // Check if user has participated in the last 24 hours
        if (block.timestamp < lastParticipationTimestamp[msg.sender] + 1 days) {
            revert("Must wait 24 hours between entries");
        }
        
        Round storage round = rounds[currentRound];
        if (!round.isActive) {
            revert("No active round");
        }
        
        if (block.timestamp >= round.endTime) {
            _endRound();
            _startNewRound();
        }
        
        // Update last participation timestamp
        lastParticipationTimestamp[msg.sender] = block.timestamp;
        
        // Mint NFT ticket
        uint256 ticketId = ticketNFT.mint(msg.sender, currentRound);
        
        // Add ticket to current round
        round.ticketIds.push(ticketId);
        round.prizePool += msg.value;
        
        emit LotteryEntry(msg.sender, currentRound, ticketId);
    }
    
    function _startNewRound() private {
        currentRound++;
        Round storage newRound = rounds[currentRound];
        newRound.startTime = block.timestamp;
        newRound.endTime = block.timestamp + ROUND_DURATION;
        newRound.isActive = true;
        
        emit RoundStarted(currentRound, newRound.startTime);
    }
    
    function _endRound() private {
        Round storage round = rounds[currentRound];
        round.isActive = false;
        
        if (round.ticketIds.length > 0) {
            // Select winner using block data as source of randomness
            uint256 winnerIndex = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        round.ticketIds.length
                    )
                )
            ) % round.ticketIds.length;
            
            uint256 winningTicketId = round.ticketIds[winnerIndex];
            address winner = ticketNFT.ownerOf(winningTicketId);
            round.winner = winner;
            
            // Calculate prize and fee amounts
            uint256 prizeAmount = (round.prizePool * WINNER_PERCENTAGE) / 100;
            uint256 feeAmount = round.prizePool - prizeAmount;
            
            // Transfer prize to winner
            (bool success1,) = winner.call{value: prizeAmount}("");
            require(success1, "Prize transfer failed");
            
            // Transfer fee to fee recipient
            (bool success2,) = feeRecipient.call{value: feeAmount}("");
            require(success2, "Fee transfer failed");
            
            emit RoundEnded(currentRound, winner, prizeAmount);
        }
    }
    
    // View functions
    function getCurrentRoundInfo() external view returns (
        uint256 roundNumber,
        uint256 startTime,
        uint256 endTime,
        uint256 prizePool,
        uint256 ticketCount,
        bool isActive
    ) {
        Round storage round = rounds[currentRound];
        return (
            currentRound,
            round.startTime,
            round.endTime,
            round.prizePool,
            round.ticketIds.length,
            round.isActive
        );
    }
    
    function getRoundTickets(uint256 roundNumber) external view returns (uint256[] memory) {
        return rounds[roundNumber].ticketIds;
    }
    
    function timeUntilRoundEnd() external view returns (uint256) {
        Round storage round = rounds[currentRound];
        if (block.timestamp >= round.endTime) return 0;
        return round.endTime - block.timestamp;
    }
}