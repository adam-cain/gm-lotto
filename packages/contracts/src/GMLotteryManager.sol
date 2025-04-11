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
    // Immutable variables
    address public immutable operator;
    GMLotteryToken public immutable ticketNFT;
    uint256 public immutable roundDuration;

    // Packed round data structure
    struct Round {
        uint64 startTime;    // Timestamp when the round started
        uint64 endTime;      // Timestamp when the round ends
        bool isActive;       // Whether the round is active
        address winner;      // Address of the winner
        uint96 prizeAmount;  // Prize amount (supports up to ~79 ETH)
        bool prizeSet;       // Whether prize is set
        bool prizeClaimed;   // Whether prize is claimed
    }

    // Current round number and rounds mapping
    uint256 public currentRound;
    mapping(uint256 => Round) public rounds;
    
    // User's last participation timestamp
    struct UserState {
        uint64 lastParticipation;  // Last participation timestamp
        uint32 participationCount; // Number of participations
    }
    mapping(address => UserState) public userStates;
    
    // Contract state
    bool public isPaused;
    
    // Events
    event LotteryEntry(address indexed participant, uint256 roundNumber, uint256 ticketId);
    event RoundStarted(uint256 roundNumber, uint256 startTime);
    event RoundEnded(uint256 roundNumber, address winner);
    event PrizeSet(uint256 roundNumber, uint256 amount);
    event PrizeClaimed(uint256 roundNumber, address winner, uint256 amount);
    event ContractPaused();
    event ContractUnpaused();
    event EmergencyWithdrawal(address indexed operator, uint256 amount);
    
    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }
    
    /**
     * @dev Constructor to initialize the lottery manager
     * @param _operator Address of the operator who can set prizes
     * @param _ticketNFT Address of the ticket NFT contract
     * @param _roundDuration Duration of each round in seconds
     */
    constructor(address _operator, address _ticketNFT, uint256 _roundDuration) {
        require(_roundDuration > 0, "Round duration must be greater than 0");
        operator = _operator;
        ticketNFT = GMLotteryToken(_ticketNFT);
        roundDuration = _roundDuration;
        _startNewRound();
    }
    
    /**
     * @dev Allows a user to enter the lottery
     * @notice Users can only enter once per 24 hours
     * @notice If the current round has ended, a new round will be started
     */
    function enterLottery() external whenNotPaused {
        UserState storage userState = userStates[msg.sender];
        
        // Check if user has participated in the last 24 hours
        if (block.timestamp < userState.lastParticipation + 1 days) {
            revert("Must wait 24 hours between entries");
        }
        
        Round storage round = rounds[currentRound];
        if (!round.isActive) {
            revert("Round is not yet active");
        }
        
        if (block.timestamp >= round.endTime) {
            _endRound();
            _startNewRound();
        }
        
        // Update user state
        userState.lastParticipation = uint64(block.timestamp);
        userState.participationCount += 1;
        
        // Mint NFT ticket
        uint256 ticketId = ticketNFT.mint(msg.sender, currentRound);
                
        emit LotteryEntry(msg.sender, currentRound, ticketId);
    }
    
    function _startNewRound() private {
        currentRound++;
        Round storage newRound = rounds[currentRound];
        newRound.startTime = uint64(block.timestamp);
        newRound.endTime = uint64(block.timestamp + roundDuration);
        newRound.isActive = true;
        
        emit RoundStarted(currentRound, newRound.startTime);
    }
    
    function _endRound() private {
        Round storage round = rounds[currentRound];
        round.isActive = false;

        uint256 roundTicketCount = ticketNFT.getRoundTicketCount(currentRound);
        
        if (roundTicketCount > 0) {
            // Select winner using block data as source of randomness
            uint256 winnerIndex = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        roundTicketCount
                    )
                )
            ) % roundTicketCount;
            
            uint256 winningTicketId = ticketNFT.getRoundTickets(currentRound)[winnerIndex];
            address winner = ticketNFT.ownerOf(winningTicketId);
            round.winner = winner;
            
            emit RoundEnded(currentRound, winner);
        }
    }

    /**
     * @dev Sets the prize amount for a completed round
     * @param roundNumber The round number to set the prize for
     * @param amount The amount of prize to set
     */
    function setPrizeAmount(uint256 roundNumber, uint256 amount) external payable whenNotPaused {
        require(msg.sender == operator, "Only operator can set prize");
        require(msg.value == amount, "Incorrect amount sent");
        require(amount > 0, "Prize amount must be greater than 0");
        require(roundNumber > 0 && roundNumber <= currentRound, "Invalid round number");
        
        Round storage round = rounds[roundNumber];
        require(!round.isActive, "Round still active");
        require(round.winner != address(0), "No winner for this round");
        require(!round.prizeSet, "Prize already set");
        require(!round.prizeClaimed, "Prize already claimed");
        
        round.prizeAmount = uint96(amount);
        round.prizeSet = true;
        
        emit PrizeSet(roundNumber, amount);
    }

    /**
     * @dev Allows the winner to claim their prize
     * @param roundNumber The round number to claim the prize for
     */
    function claimPrize(uint256 roundNumber) external whenNotPaused {
        Round storage round = rounds[roundNumber];
        require(round.winner == msg.sender, "Not the winner");
        require(round.prizeSet, "Prize not set");
        require(!round.prizeClaimed, "Prize already claimed");
        
        // Store prize amount before updating state
        uint256 prizeAmount = round.prizeAmount;
        
        // Update state before external call
        round.prizeClaimed = true;
        
        // Make external call
        (bool success,) = msg.sender.call{value: prizeAmount}("");
        require(success, "Prize transfer failed");
        
        emit PrizeClaimed(roundNumber, msg.sender, prizeAmount);
    }
    
    // View functions
    function getPastRounds() private view returns (uint256[] memory) {
        uint256 roundCount = currentRound;
        uint256[] memory pastRounds = new uint256[](roundCount);
        for (uint256 i = 1; i <= roundCount; i++) {
            pastRounds[i - 1] = i;
        }
        return pastRounds;
    }

    function getCurrentRoundInfo() external view returns (
        uint256 roundNumber,
        uint256 endTime,
        uint256 roundTicketCount,
        uint256 userRoundTicketCount,
        uint256[] memory pastRounds
    ) {
        Round storage round = rounds[currentRound];
        return (
            currentRound,
            round.endTime,
            ticketNFT.getRoundTicketCount(currentRound),
            ticketNFT.getUserTicketCountForRound(msg.sender, currentRound),
            getPastRounds()
        );
    }
    
    function getRoundInfo(uint256 roundNumber) public view returns (
        uint256 startTime,
        uint256 endTime,
        uint256 roundTicketCount,
        uint256 userRoundTicketCount,
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
            ticketNFT.getRoundTicketCount(roundNumber),
            ticketNFT.getUserTicketCountForRound(msg.sender, roundNumber),
            round.isActive,
            round.winner,
            round.prizeAmount,
            round.prizeSet,
            round.prizeClaimed
        );
    }
    
    function timeUntilRoundEnd() external view returns (uint256) {
        Round storage round = rounds[currentRound];
        if (block.timestamp >= round.endTime) return 0;
        return round.endTime - block.timestamp;
    }

    /**
     * @dev Pauses the contract in case of emergency
     * @notice Only callable by the operator
     */
    function pause() external {
        require(msg.sender == operator, "Only operator can pause");
        isPaused = true;
        emit ContractPaused();
    }
    
    /**
     * @dev Unpauses the contract
     * @notice Only callable by the operator
     */
    function unpause() external {
        require(msg.sender == operator, "Only operator can unpause");
        isPaused = false;
        emit ContractUnpaused();
    }
    
    /**
     * @dev Allows the operator to withdraw all funds in case of emergency
     * @notice Only callable when the contract is paused
     */
    function emergencyWithdraw() external {
        require(msg.sender == operator, "Only operator can withdraw");
        require(isPaused, "Contract must be paused");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success,) = operator.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit EmergencyWithdrawal(operator, balance);
    }
}