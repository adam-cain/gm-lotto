export const LOTTERY_CONTRACT_ADDRESS = '0x5A9d7C744C9853c26d43EaBDf866151603aAB469';

export const LOTTERY_CONTRACT_ABI = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_feeRecipient",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "FEE_PERCENTAGE",
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
        "name": "ROUND_DURATION",
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
        "name": "WINNER_PERCENTAGE",
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
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "feeRecipient",
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
                "name": "prizePool",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "participantCount",
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
        "name": "getRoundParticipants",
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
                "type": "address[]",
                "internalType": "address[]"
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
                "name": "prizePool",
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
            },
            {
                "name": "prize",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
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
]; 