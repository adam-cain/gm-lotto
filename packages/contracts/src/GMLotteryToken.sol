// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GMLotteryToken is ERC721, Ownable {
    // Simple counter for token IDs
    uint256 private _nextTokenId;

    // Mapping to store user's ticket IDs
    mapping(address => uint256[]) private _userTickets;
    
    // Mapping to store ticket round number
    mapping(uint256 => uint256) private _ticketRound;

    // Events
    event TicketMinted(address indexed owner, uint256 indexed tokenId, uint256 roundNumber);

    constructor() ERC721("GM Lotto Ticket", "GMLT") Ownable(msg.sender) {}

    function mint(address to, uint256 roundNumber) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(to, tokenId);
        _userTickets[to].push(tokenId);
        _ticketRound[tokenId] = roundNumber;
        
        emit TicketMinted(to, tokenId, roundNumber);
        return tokenId;
    }

    function getUserTickets(address user) external view returns (uint256[] memory) {
        return _userTickets[user];
    }

    function getUserTicketCount(address user) external view returns (uint256) {
        return _userTickets[user].length;
    }

    function getTicketRound(uint256 tokenId) external view returns (uint256) {
        return _ticketRound[tokenId];
    }

    function getUserTicketsForRound(address user, uint256 roundNumber) external view returns (uint256[] memory) {
        uint256[] memory allTickets = _userTickets[user];
        uint256 count = 0;
        
        // Count tickets for the specified round
        for (uint256 i = 0; i < allTickets.length; i++) {
            if (_ticketRound[allTickets[i]] == roundNumber) {
                count++;
            }
        }
        
        // Create array with correct size
        uint256[] memory roundTickets = new uint256[](count);
        uint256 index = 0;
        
        // Fill array with tickets for the specified round
        for (uint256 i = 0; i < allTickets.length; i++) {
            if (_ticketRound[allTickets[i]] == roundNumber) {
                roundTickets[index] = allTickets[i];
                index++;
            }
        }
        
        return roundTickets;
    }
} 