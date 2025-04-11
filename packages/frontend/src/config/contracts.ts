export const LOTTERY_CONTRACT_ABI = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_operator",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_ticketNFT",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_roundDuration",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "claimPrize",
        "inputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "currentRound",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "enterLottery",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getCurrentRoundInfo",
        "inputs": [],
        "outputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "startTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "endTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "ticketCount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "isActive",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRoundInfo",
        "inputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "startTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "endTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "ticketIds",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "isActive",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "winner",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "prizeAmount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "prizeSet",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "prizeClaimed",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRoundTickets",
        "inputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "lastParticipationTimestamp",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "operator",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "roundDuration",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "rounds",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "startTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "endTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "isActive",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "winner",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "prizeAmount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "prizeSet",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "prizeClaimed",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setPrizeAmount",
        "inputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "ticketNFT",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract GMLotteryToken"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "timeUntilRoundEnd",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isPaused",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "LotteryEntry",
        "inputs": [
            {
                "name": "participant",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "roundNumber",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "ticketId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PrizeClaimed",
        "inputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "winner",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PrizeSet",
        "inputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoundEnded",
        "inputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "winner",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoundStarted",
        "inputs": [
            {
                "name": "roundNumber",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "startTime",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    }
] as const;

export const LOTTERY_TOKEN_ABI = [
    {
        "type": "function",
        "name": "getUserTickets",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getUserTicketCount",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getTicketRound",
        "inputs": [
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getUserTicketsForRound",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "roundNumber",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    }
] as const;