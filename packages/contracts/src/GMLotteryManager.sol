// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./GMLotteryToken.sol";

contract GMLotteryManager {
    // Immutable variables
    address public immutable operator;
    GMLotteryToken public immutable ticketNFT;
    uint256 public immutable roundDuration;

    // Lottery round tracking
    struct Round {
        uint256 startTime;
        uint256 endTime;
        uint256[] ticketIds;
        bool isActive;
        address winner;
        uint256 prizeAmount;
        bool prizeSet;
        bool prizeClaimed;
    }

    // Current round number and rounds mapping
    uint256 public currentRound;
    mapping(uint256 => Round) public rounds;
    
    // User's last participation timestamp
    mapping(address => uint256) public lastParticipationTimestamp;
    
    // Events
    event LotteryEntry(address indexed participant, uint256 roundNumber, uint256 ticketId);
    event RoundStarted(uint256 roundNumber, uint256 startTime);
    event RoundEnded(uint256 roundNumber, address winner);
    event PrizeSet(uint256 roundNumber, uint256 amount);
    event PrizeClaimed(uint256 roundNumber, address winner, uint256 amount);
    
    constructor(address _operator, address _ticketNFT, uint256 _roundDuration) {
        require(_roundDuration > 0, "Round duration must be greater than 0");
        operator = _operator;
        ticketNFT = GMLotteryToken(_ticketNFT);
        roundDuration = _roundDuration;
        _startNewRound();
    }
    
    function enterLottery() external {
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
        
        emit LotteryEntry(msg.sender, currentRound, ticketId);
    }
    
    function _startNewRound() private {
        currentRound++;
        Round storage newRound = rounds[currentRound];
        newRound.startTime = block.timestamp;
        newRound.endTime = block.timestamp + roundDuration;
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
            
            emit RoundEnded(currentRound, winner);
        }
    }

    function setPrizeAmount(uint256 roundNumber, uint256 amount) external payable {
        require(msg.sender == operator, "Only operator can set prize");
        require(msg.value == amount, "Incorrect amount sent");
        
        Round storage round = rounds[roundNumber];
        require(!round.isActive, "Round still active");
        require(round.winner != address(0), "No winner for this round");
        require(!round.prizeSet, "Prize already set");
        require(!round.prizeClaimed, "Prize already claimed");
        
        round.prizeAmount = amount;
        round.prizeSet = true;
        
        emit PrizeSet(roundNumber, amount);
    }

    function claimPrize(uint256 roundNumber) external {
        Round storage round = rounds[roundNumber];
        require(round.winner == msg.sender, "Not the winner");
        require(round.prizeSet, "Prize not set");
        require(!round.prizeClaimed, "Prize already claimed");
        
        round.prizeClaimed = true;
        (bool success,) = msg.sender.call{value: round.prizeAmount}("");
        require(success, "Prize transfer failed");
        
        emit PrizeClaimed(roundNumber, msg.sender, round.prizeAmount);
    }
    
    // View functions
    function getCurrentRoundInfo() external view returns (
        uint256 roundNumber,
        uint256 startTime,
        uint256 endTime,
        uint256 ticketCount,
        bool isActive
    ) {
        Round storage round = rounds[currentRound];
        return (
            currentRound,
            round.startTime,
            round.endTime,
            round.ticketIds.length,
            round.isActive
        );
    }
    
    function getRoundInfo(uint256 roundNumber) external view returns (
        uint256 startTime,
        uint256 endTime,
        uint256[] memory ticketIds,
        bool isActive,
        address winner,
        uint256 prizeAmount,
        bool prizeSet,
        bool prizeClaimed
    ) {
        Round storage round = rounds[roundNumber];
        return (
            round.startTime,
            round.endTime,
            round.ticketIds,
            round.isActive,
            round.winner,
            round.prizeAmount,
            round.prizeSet,
            round.prizeClaimed
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