// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract GMLotto {
    // Immutable variables
    address public immutable feeRecipient;
    uint256 public immutable ENTRY_FEE;
    uint256 public constant ROUND_DURATION = 24 hours;
    uint256 public constant WINNER_PERCENTAGE = 90; // 90% of pool goes to winner
    uint256 public constant FEE_PERCENTAGE = 10; // 10% goes to fee recipient

    // Lottery round tracking
    struct Round {
        uint256 startTime;
        uint256 endTime;
        uint256 prizePool;
        address[] participants;
        bool isActive;
        address winner;
    }

    // Current round number and rounds mapping
    uint256 public currentRound;
    mapping(uint256 => Round) public rounds;
    
    // User's last participation timestamp
    mapping(address => uint256) public lastParticipationTimestamp;
    
    // Events
    event LotteryEntry(address indexed participant, uint256 roundNumber);
    event RoundStarted(uint256 roundNumber, uint256 startTime);
    event RoundEnded(uint256 roundNumber, address winner, uint256 prize);
    
    constructor() {
        feeRecipient = 0x7500A83DF2aF99B2755c47B6B321a8217d876a85;
        ENTRY_FEE = 0.000029 ether;
        _startNewRound();
    }
    
    function enterLottery() external payable {
        if (msg.value != ENTRY_FEE) {
            revert("Incorrect entry fee");
        }
        
        Round storage round = rounds[currentRound];
        if (!round.isActive) {
            revert("No active round");
        }
        
        if (block.timestamp >= round.endTime) {
            _endRound();
            _startNewRound();
        }
        
        // Add participant to current round
        round.participants.push(msg.sender);
        round.prizePool += msg.value;
        
        emit LotteryEntry(msg.sender, currentRound);
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
        
        if (round.participants.length > 0) {
            // Select winner using block data as source of randomness
            uint256 winnerIndex = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        round.participants.length
                    )
                )
            ) % round.participants.length;
            
            address winner = round.participants[winnerIndex];
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
        uint256 participantCount,
        bool isActive
    ) {
        Round storage round = rounds[currentRound];
        return (
            currentRound,
            round.startTime,
            round.endTime,
            round.prizePool,
            round.participants.length,
            round.isActive
        );
    }
    
    function getRoundParticipants(uint256 roundNumber) external view returns (address[] memory) {
        return rounds[roundNumber].participants;
    }
    
    function timeUntilRoundEnd() external view returns (uint256) {
        Round storage round = rounds[currentRound];
        if (block.timestamp >= round.endTime) return 0;
        return round.endTime - block.timestamp;
    }
}