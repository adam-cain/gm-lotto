## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

# GM Lotto Contracts

A decentralized lottery system built on Ethereum and compatible EVM chains. Each lottery ticket is represented as an NFT, providing transparency and verifiability.

## Features

- **NFT Tickets**: Each lottery entry is minted as a unique NFT
- **Weekly Rounds**: New lottery rounds start automatically every week
- **Fair Distribution**: 90% of the prize pool goes to the winner, 10% to the fee recipient
- **Anti-Spam**: 24-hour cooldown between entries per user
- **Transparent**: All rounds and winners are recorded on-chain
- **Multi-Chain**: Deployable on any EVM-compatible chain

## Contracts

### GMLottoNFT

The NFT contract that manages lottery tickets:
- Mints unique tickets for each entry
- Tracks tickets per user and round
- Provides view functions for ticket queries
- Only the lottery contract can mint tickets

### GMLotto

The main lottery contract:
- Manages weekly lottery rounds
- Handles entry fees and prize distribution
- Selects winners using on-chain randomness
- Automatically starts new rounds
- Distributes prizes (90% to winner, 10% fee)

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Deploy

```shell
$ forge script script/DeployGMLottery.s.sol:DeployGMLottery --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Verify Contracts

```shell
$ forge verify-contract <nft_address> GMLottoNFT --chain <chain_name>
$ forge verify-contract <lottery_address> GMLotto --chain <chain_name>
```

## Future Improvements

- [ ] Add minimum entry fee
- [ ] Add maximum tickets per user per round
- [ ] Add round history view
- [ ] Add past winners view
- [ ] Add emergency pause functionality
- [ ] Add multi-winner support
- [ ] Add tiered prize distribution

## License

MIT
