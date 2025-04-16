// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GMLotteryToken
 * @dev ERC721 token representing lottery tickets
 * @notice This contract manages the NFT tickets for the lottery system
 */
contract GMLotteryToken is ERC721, Ownable {
    // Simple counter for token IDs - starts at 1 to avoid the initial zero ID
    uint256 private _nextTokenId = 1;

    // Packed ticket data structure
    struct Ticket {
        uint64 roundNumber;  // Round number this ticket belongs to
        address owner;       // Current owner of the ticket
    }

    // Mapping to store ticket data
    mapping(uint256 => Ticket) private _tickets;
    
    // Mapping to store user's ticket IDs
    mapping(address => uint256[]) private _userTickets;
    
    // Mapping to store tickets by round
    mapping(uint256 => uint256[]) private _roundTickets;

    // Mapping to store user tickets by round for O(1) lookups
    // roundNumber => user => ticketCount
    mapping(uint256 => mapping(address => uint256)) private _userTicketsByRound;

    // Mapping to store the first token ID of each round
    // roundNumber => firstTokenId
    mapping(uint256 => uint256) private _roundFirstTokenId;

    // Events
    event TicketMinted(address indexed owner, uint256 indexed tokenId, uint256 roundNumber);

    /**
     * @dev Constructor to initialize the token
     * @notice Sets the token name to "GM Lotto Ticket" and symbol to "GMLT"
     */
    constructor() ERC721("GM Lotto Ticket", "GMLT") Ownable(msg.sender) {}

    /**
     * @dev Mints a new ticket for a specific round
     * @param to Address to mint the ticket to
     * @param roundNumber The round number this ticket belongs to
     * @return The ID of the minted ticket
     */
    function mint(address to, uint256 roundNumber) external onlyOwner returns (uint256) {
        // Get the current token ID
        uint256 tokenId = _nextTokenId;
        
        // If this is the first ticket of the round, record its ID
        if (_roundFirstTokenId[roundNumber] == 0) {
            _roundFirstTokenId[roundNumber] = tokenId;
        }
        
        // Create and store ticket data
        _tickets[tokenId] = Ticket({
            roundNumber: uint64(roundNumber),
            owner: to
        });
        
        // Update user's tickets
        _userTickets[to].push(tokenId);
        
        // Update round's tickets
        _roundTickets[roundNumber].push(tokenId);
        
        // Update user tickets by round count
        _userTicketsByRound[roundNumber][to] += 1;
        
        // Mint the NFT
        _safeMint(to, tokenId);
        
        // Use unchecked to save gas on overflow check that we know won't overflow
        unchecked {
            _nextTokenId = tokenId + 1;
        }
        
        emit TicketMinted(to, tokenId, roundNumber);
        return tokenId;
    }

    /**
     * @dev Overrides the default authorization check
     * @notice Only allows minting, no transfers
     */
    function _isAuthorized(address owner, address spender, uint256 tokenId) internal view virtual override returns (bool) {
        // Only allow minting, no transfers
        return spender == owner && _ownerOf(tokenId) == address(0);
    }

    /**
     * @dev Returns all tickets owned by a user
     * @param user Address of the user
     * @return Array of ticket IDs owned by the user
     */
    function getUserTickets(address user) external view returns (uint256[] memory) {
        return _userTickets[user];
    }

    /**
     * @dev Returns the number of tickets owned by a user
     * @param user Address of the user
     * @return Number of tickets owned by the user
     */
    function getUserTicketCount(address user) external view returns (uint256) {
        return _userTickets[user].length;
    }

    /**
     * @dev Returns the number of tickets for a specific round
     * @param roundNumber The round number
     * @return Number of tickets for the specified round
     */
    function getRoundTicketCount(uint256 roundNumber) external view returns (uint256) {
        return _roundTickets[roundNumber].length;
    }

    /**
     * @dev Checks if a round has any tickets
     * @param roundNumber The round number to check
     * @return True if the round has tickets, false otherwise
     */
    function roundHasTickets(uint256 roundNumber) external view returns (bool) {
        return _roundTickets[roundNumber].length > 0;
    }

    /**
     * @dev Returns the round number for a specific ticket
     * @param tokenId ID of the ticket
     * @return Round number the ticket belongs to
     */
    function getTicketRound(uint256 tokenId) external view returns (uint256) {
        return _tickets[tokenId].roundNumber;
    }

    /**
     * @dev Returns all tickets for a specific round
     * @param roundNumber The round number
     * @return Array of ticket IDs for the specified round, used by the manager 
     * contract to determine the winner
     */
    function getRoundTickets(uint256 roundNumber) external view returns (uint256[] memory) {
        return _roundTickets[roundNumber];
    }

    /**
     * @dev Returns the first token ID of a specific round
     * @param roundNumber The round number
     * @return First token ID of the round, or 0 if the round has no tickets
     */
    function getFirstTokenIdOfRound(uint256 roundNumber) external view returns (uint256) {
        return _roundFirstTokenId[roundNumber];
    }

    /**
     * @dev Returns the first token ID of the next round (current _nextTokenId)
     * @return Next token ID to be minted
     */
    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Returns the range of token IDs for a specific round
     * @param roundNumber The round number
     * @return startId First token ID of the round (inclusive)
     * @return endId Last token ID of the round (inclusive), or 0 if no tickets
     */
    function getRoundTokenIdRange(uint256 roundNumber) external view returns (uint256 startId, uint256 endId) {
        startId = _roundFirstTokenId[roundNumber];
        
        // If the round has no tickets, return 0 for endId
        if (startId == 0) {
            return (0, 0);
        }
        
        uint256 ticketCount = _roundTickets[roundNumber].length;
        if (ticketCount == 0) {
            return (startId, 0);
        }
        
        // Calculate the end ID (startId + count - 1)
        endId = startId + ticketCount - 1;
        return (startId, endId);
    }

    /**
     * @dev Returns the number of tickets owned by a user for a specific round
     * @param user Address of the user
     * @param roundNumber The round number
     * @return Number of tickets owned by the user for the specified round
     */
    function getUserTicketCountForRound(address user, uint256 roundNumber) external view returns (uint256) {
        if(address(0) == user) {
            return 0;
        }
        
        // O(1) lookup using the new mapping
        return _userTicketsByRound[roundNumber][user];
    }

    /**
     * @dev Returns the total number of tickets minted
     * @return Total number of tickets minted
     */
    function getTotalTicketCount() external view returns (uint256) {
        return _nextTokenId - 1; // Subtract 1 since we start from 1 and nextTokenId is the next to be minted
    }
} 