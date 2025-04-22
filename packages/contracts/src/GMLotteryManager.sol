// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./GMLotteryToken.sol";

/**
 * @title GMLotteryManager
 * @dev Manages lottery rounds, ticket distribution, and prize distribution
 * @notice This contract handles the core lottery functionality including round management,
 * ticket distribution, winner selection, and prize distribution
 */
contract GMLotteryManager {
    // Custom errors for gas optimization
    error ContractIsPaused();
    error OnlyOperator();
    error WaitPeriodNotOver();
    error RoundNotActive();
    error RoundStillActive();
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
    error NoTicketsInRound();

    // Immutable variables
    address public immutable operator;
    GMLotteryToken public immutable ticketNFT;

    // Packed round data structure
    struct Round {
        uint64 startTime;    // Timestamp when the round started
        bool isActive;       // Whether the round is active
        bool prizeSet;       // Whether prize is set
        bool prizeClaimed;   // Whether prize is claimed
        address winner;      // Address of the winner
        uint96 prizeAmount;  // Prize amount (supports up to ~79 ETH)
        uint256 winningTicketId; // The ID of the winning ticket
    }

    // Extended round struct for getCurrentRoundInfo
    struct RoundWithNumber {
        uint256 roundNumber;
        uint64 startTime;
        bool isActive;
        bool prizeSet;
        bool prizeClaimed;
        address winner;
        uint96 prizeAmount;
        uint256 winningTicketId;
        uint256 firstTokenId;
    }

    // Current round number and rounds mapping
    uint256 public currentRound;
    mapping(uint256 => Round) public rounds;
    
    // User's last participation timestamp
    mapping(address => uint64) public lastParticipation;
    
    // Contract state
    bool public isPaused;
    
    // Events
    event LotteryEntry(address indexed participant, uint256 roundNumber, uint256 ticketId);
    event RoundStarted(uint256 roundNumber, uint256 startTime);
    event RoundEnded(uint256 roundNumber, address winner, uint256 winningTicketId);
    event PrizeSet(uint256 roundNumber, uint256 amount);
    event PrizeClaimed(uint256 roundNumber, address winner, uint256 amount);
    event ContractPaused();
    event ContractUnpaused();
    event EmergencyWithdrawal(address indexed operator, uint256 amount);
    
    modifier whenNotPaused() {
        if (isPaused) revert ContractIsPaused();
        _;
    }
    
    modifier onlyOperator() {
        if (msg.sender != operator) revert OnlyOperator();
        _;
    }
    
    /**
     * @dev Constructor to initialize the lottery manager
     * @param _operator Address of the operator who can manage rounds and set prizes
     * @param _ticketNFT Address of the ticket NFT contract
     */
    constructor(address _operator, address _ticketNFT) {
        operator = _operator;
        ticketNFT = GMLotteryToken(_ticketNFT);
        // First round is automatically started
        _startNewRound();
    }
    
    /**
     * @dev Allows a user to enter the lottery
     * @notice Users can only enter once per 24 hours
     */
    function enterLottery() external whenNotPaused returns (uint64) {
        uint64 userLastParticipation = lastParticipation[msg.sender];
        
        // Check if user has participated in the last 24 hours
        if (block.timestamp < userLastParticipation + 1 days) {
            revert WaitPeriodNotOver();
        }
        
        Round storage round = rounds[currentRound];
        if (!round.isActive) {
            revert RoundNotActive();
        }
        
        // Update user state
        lastParticipation[msg.sender] = uint64(block.timestamp);
        
        // Mint NFT ticket
        uint256 ticketId = ticketNFT.mint(msg.sender, currentRound);
                
        emit LotteryEntry(msg.sender, currentRound, ticketId);
        return lastParticipation[msg.sender];
    }
    
    /**
     * @dev Ends the current round, selects a winner if possible, sets the prize, and starts a new round
     * @notice Only callable by the operator
     * @param prizeAmount The amount of prize to set for the ending round
     */
    function endCurrentRound(uint256 prizeAmount) external payable onlyOperator whenNotPaused {
        if (!rounds[currentRound].isActive) revert NoActiveRound();
        if (msg.value != prizeAmount) revert IncorrectAmount();
        if (prizeAmount == 0) revert PrizeAmountTooLow();
        
        uint256 endingRound = currentRound;
        
        // End the current round and select winner if possible
        _endRound();
        
        // Set prize for the ending round
        Round storage round = rounds[endingRound];
        
        round.prizeAmount = uint96(prizeAmount);
        round.prizeSet = true;
        
        emit PrizeSet(endingRound, prizeAmount);
        
        // Start the next round
        _startNewRound();
    }
    
    function _startNewRound() private {
        unchecked {
            currentRound++;
        }
        
        Round storage newRound = rounds[currentRound];
        newRound.startTime = uint64(block.timestamp);
        newRound.isActive = true;
        
        emit RoundStarted(currentRound, newRound.startTime);
    }
    
    function _endRound() private {
        Round storage round = rounds[currentRound];
        round.isActive = false;

        uint256 roundTicketCount = ticketNFT.getRoundTicketCount(currentRound);
        
        if (roundTicketCount > 0) {
            // Get token ID range for this round
            (uint256 startId, uint256 endId) = ticketNFT.getRoundTokenIdRange(currentRound);
            
            if (startId == 0 || endId == 0) {
                // No tickets in round (should never happen if roundTicketCount > 0)
                emit RoundEnded(currentRound, address(0), 0);
                return;
            }
            
            // Generate random index more efficiently
            uint256 winnerIndex;
            
            unchecked {
                winnerIndex = uint256(
                    keccak256(
                        abi.encodePacked(
                            block.timestamp,
                            block.prevrandao,
                            roundTicketCount
                        )
                    )
                ) % roundTicketCount;
            }
            
            // Calculate winning ticket ID directly from the range
            uint256 winningTicketId = startId + winnerIndex; 
            
            // Ensure it's within the valid range
            if (winningTicketId > endId) {
                winningTicketId = endId;
            }
            
            address winner = ticketNFT.ownerOf(winningTicketId);
            round.winner = winner;
            round.winningTicketId = winningTicketId;
            
            emit RoundEnded(currentRound, winner, winningTicketId);
        } else {
            // No tickets in this round, so no winner
            emit RoundEnded(currentRound, address(0), 0);
        }
    }

    /**
     * @dev Allows the winner to claim their prize
     * @param roundNumber The round number to claim the prize for
     */
    function claimPrize(uint256 roundNumber) external whenNotPaused {
        Round storage round = rounds[roundNumber];
        if (round.winner != msg.sender) revert NotWinner();
        if (!round.prizeSet) revert PrizeNotSet();
        if (round.prizeClaimed) revert PrizeAlreadyClaimed();
        
        // Store prize amount before updating state
        uint256 prizeAmount = round.prizeAmount;
        
        // Update state before external call
        round.prizeClaimed = true;
        
        // Make external call
        (bool success,) = msg.sender.call{value: prizeAmount}("");
        if (!success) revert PrizeTransferFailed();
        
        emit PrizeClaimed(roundNumber, msg.sender, prizeAmount);
    }
    
    /**
     * @dev Gets current round information, optimized to cache round ticket count
     */
    function getCurrentRoundInfo() external view returns (
        uint256 roundNumber,
        uint256 startTime,
        uint256 roundTicketCount,
        uint256 userRoundTicketCount,
        RoundWithNumber[] memory pastRounds
    ) {
        uint256 roundCount = currentRound - 1; // Exclude current round
        RoundWithNumber[] memory previousRounds = new RoundWithNumber[](roundCount);
        
        // Cache current round's ticket count to avoid multiple external calls
        uint256 curRoundTicketCount = ticketNFT.getRoundTicketCount(currentRound);
        uint256 curUserTicketCount = ticketNFT.getUserTicketCountForRound(msg.sender, currentRound);
        
        for (uint256 i = 1; i <= roundCount; i++) {
            Round storage roundData = rounds[i];
            uint256 firstTokenId = ticketNFT.getFirstTokenIdOfRound(i);
            
            previousRounds[i - 1] = RoundWithNumber({
                roundNumber: i,
                startTime: roundData.startTime,
                isActive: roundData.isActive,
                prizeSet: roundData.prizeSet,
                prizeClaimed: roundData.prizeClaimed,
                winner: roundData.winner,
                prizeAmount: roundData.prizeAmount,
                winningTicketId: roundData.winningTicketId,
                firstTokenId: firstTokenId
            });
        }

        Round storage round = rounds[currentRound];
        return (
            currentRound,
            round.startTime,
            curRoundTicketCount,
            curUserTicketCount,
            previousRounds
        );
    }
    
    /**
     * @dev Gets information about a specific round, optimized to cache ticket counts
     */
    function getRoundInfo(uint256 roundNumber) public view returns (
        uint256 startTime,
        uint256 roundTicketCount,
        uint256 userRoundTicketCount,
        bool isActive,
        address winner,
        uint256 prizeAmount,
        bool prizeSet,
        bool prizeClaimed,
        uint256 winningTicketId,
        uint256 firstTokenId
    ) {
        Round storage round = rounds[roundNumber];
        
        // Cache round's ticket count to avoid multiple external calls
        uint256 cachedRoundTicketCount = ticketNFT.getRoundTicketCount(roundNumber);
        uint256 cachedUserTicketCount = ticketNFT.getUserTicketCountForRound(msg.sender, roundNumber);
        uint256 firstId = ticketNFT.getFirstTokenIdOfRound(roundNumber);
        
        return (
            round.startTime,
            cachedRoundTicketCount,
            cachedUserTicketCount,
            round.isActive,
            round.winner,
            round.prizeAmount,
            round.prizeSet,
            round.prizeClaimed,
            round.winningTicketId,
            firstId
        );
    }

    // EMERGENCY FUNCTIONS

    /**
     * @dev Pauses the contract in case of emergency
     * @notice Only callable by the operator
     */
    function pause() external onlyOperator {
        isPaused = true;
        emit ContractPaused();
    }
    
    /**
     * @dev Unpauses the contract
     * @notice Only callable by the operator
     */
    function unpause() external onlyOperator {
        isPaused = false;
        emit ContractUnpaused();
    }
    
    /**
     * @dev Allows the operator to withdraw all funds in case of emergency
     * @notice Only callable when the contract is paused
     */
    function emergencyWithdraw() external onlyOperator {
        if (!isPaused) revert MustBePaused();
        
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoFundsToWithdraw();
        
        (bool success,) = operator.call{value: balance}("");
        if (!success) revert WithdrawalFailed();
        
        emit EmergencyWithdrawal(operator, balance);
    }
}