import {
  useReadContract,
  useWriteContract,
  useSwitchChain,
  useTransaction,
  useAccount,
} from "wagmi";
import {
  LOTTERY_CONTRACT_ABI,
  LOTTERY_TOKEN_ABI,
} from "../config/contracts";
import { formatEther } from "viem";
import { useState } from "react";

/**
 * Interface representing basic round information
 * @property roundNumber - The current round number
 * @property endTime - Unix timestamp when the round ends
 * @property ticketCount - Number of tickets in the current round
 * @property userTicketCount - Number of tickets owned by the user
 * @property pastRounds - Array of past round numbers
 */
export interface RoundInfo {
  roundNumber: bigint;
  endTime: bigint;
  ticketCount: bigint;
  userTicketCount: bigint;
  pastRounds: bigint[];
}

/**
 * Interface representing detailed round information
 * @property startTime - Unix timestamp when the round started
 * @property endTime - Unix timestamp when the round ends
 * @property roundTicketCount - Number of tickets in the round
 * @property userRoundTicketCount - Number of tickets owned by the user in this round
 * @property isActive - Whether the round is currently active
 * @property winner - Address of the round winner
 * @property prizeAmount - Amount of prize in wei
 * @property prizeSet - Whether the prize has been set
 * @property prizeClaimed - Whether the prize has been claimed
 */
export interface FullRoundInfo {
  startTime: bigint;
  endTime: bigint;
  roundTicketCount: bigint;
  userRoundTicketCount: bigint;
  isActive: boolean;
  winner: `0x${string}`;
  prizeAmount: bigint;
  prizeSet: boolean;
  prizeClaimed: boolean;
}

/**
 * Interface representing user state
 * @property lastParticipation - Last participation timestamp
 * @property participationCount - Number of participations
 */
export interface UserState {
  lastParticipation: bigint;
  participationCount: bigint;
}

/**
 * Custom hook for interacting with the GM Lottery contract
 * @param chainId - The chain ID where the contract is deployed
 * @param contractAddress - The address of the GMLotteryManager contract
 * @param tokenAddress - The address of the GMLotteryToken contract
 * @returns Object containing contract interaction methods and state
 */
export function useLotteryContract(
  chainId: number,
  contractAddress: `0x${string}`,
  tokenAddress: `0x${string}`
) {
  const { switchChain } = useSwitchChain();
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  // Contract configuration for lottery manager
  const contractData = {
    address: contractAddress,
    abi: LOTTERY_CONTRACT_ABI,
    chainId: chainId,
  }

  // Contract configuration for NFT token
  const tokenContractData = {
    address: tokenAddress,
    abi: LOTTERY_TOKEN_ABI,
    chainId: chainId,
  }

  // Get current round information
  const { data: rawRoundInfo, refetch: refetchRoundInfo } = useReadContract({
    ...contractData,
    functionName: "getCurrentRoundInfo",
  }) as { data: [bigint, bigint, bigint, bigint, bigint[]] | undefined; refetch: () => void };  

  // Format round information
  const roundInfo: RoundInfo | undefined = rawRoundInfo ? {
    roundNumber: rawRoundInfo[0],
    endTime: rawRoundInfo[1],
    ticketCount: rawRoundInfo[2],
    userTicketCount: rawRoundInfo[3],
    pastRounds: rawRoundInfo[4]
  } : undefined;

  // Get current round number
  const { data: currentRound } = useReadContract({
    ...contractData,
    functionName: "currentRound",
  });

  // Get time remaining until round end
  const { data: timeUntilEnd } = useReadContract({
    ...contractData,
    functionName: "timeUntilRoundEnd",
  });

  // Get user's state
  const { data: userState } = useReadContract({
    ...contractData,
    functionName: "userStates",
    args: [address || '0x0'],
  }) as { data: [bigint, bigint] | undefined };

  // Get user's ticket IDs
  const { data: userTickets } = useReadContract({
    ...tokenContractData,
    functionName: "getUserTickets",
    args: [address || '0x0'],
  });

  // Get user's total ticket count
  const { data: userTicketCount } = useReadContract({
    ...tokenContractData,
    functionName: "getUserTicketCount",
    args: [address || '0x0'],
  });

  // Get contract pause state
  const { data: isPaused } = useReadContract({
    ...contractData,
    functionName: "isPaused",
  });

  /**
   * Enter the current lottery round
   * @returns Promise that resolves to true if successful
   * @throws Error if transaction fails
   */
  const enterLottery = async () => {
    try {
      // Switch to the correct chain first
      switchChain({
        chainId: chainId,
      });
      
      const result = writeContract({
        ...contractData,
        functionName: "enterLottery",
        gas: BigInt(1000000),
      });
      
      setTxHash(result as unknown as `0x${string}`);
      refetchRoundInfo();
      return true;
    } catch (error) {
      console.error("Error entering lottery:", error);
      throw error;
    }
  };

  /**
   * Set prize amount for a completed round
   * @param roundNumber - The round number to set prize for
   * @param amount - The prize amount in wei
   * @returns Promise that resolves to true if successful
   * @throws Error if transaction fails
   */
  const setPrizeAmount = async (roundNumber: bigint, amount: bigint) => {
    try {
      await switchChain({
        chainId: chainId,
      });

      const result = await writeContract({
        ...contractData,
        functionName: "setPrizeAmount",
        args: [roundNumber, amount],
        value: amount,
      });

      setTxHash(result as unknown as `0x${string}`);
      return true;
    } catch (error) {
      console.error("Error setting prize amount:", error);
      throw error;
    }
  };

  /**
   * Claim prize for a completed round
   * @param roundNumber - The round number to claim prize for
   * @returns Promise that resolves to true if successful
   * @throws Error if transaction fails
   */
  const claimPrize = async (roundNumber: bigint) => {
    try {
      await switchChain({
        chainId: chainId,
      });

      const result = await writeContract({
        ...contractData,
        functionName: "claimPrize",
        args: [roundNumber],
      });

      setTxHash(result as unknown as `0x${string}`);
      return true;
    } catch (error) {
      console.error("Error claiming prize:", error);
      throw error;
    }
  };

  /**
   * Get detailed information about a specific round
   * @param roundNumber - The round number to get info for
   * @returns Promise that resolves to FullRoundInfo or undefined
   */
  const getRoundInfo = async (roundNumber: bigint): Promise<FullRoundInfo | undefined> => {
    try {
      const { data } = await useReadContract({
        ...contractData,
        functionName: "getRoundInfo",
        args: [roundNumber],
      }) as { data: [bigint, bigint, bigint, bigint, boolean, `0x${string}`, bigint, boolean, boolean] | undefined };

      if (!data) return undefined;

      return {
        startTime: data[0],
        endTime: data[1],
        roundTicketCount: data[2],
        userRoundTicketCount: data[3],
        isActive: data[4],
        winner: data[5],
        prizeAmount: data[6],
        prizeSet: data[7],
        prizeClaimed: data[8]
      };
    } catch (error) {
      console.error("Error getting round info:", error);
      return undefined;
    }
  };

  /**
   * Get the round number for a specific ticket
   * @param tokenId - The ticket ID to check
   * @returns Promise that resolves to round number or undefined
   */
  const getTicketRound = async (tokenId: bigint): Promise<bigint | undefined> => {
    try {
      const { data } = await useReadContract({
        ...tokenContractData,
        functionName: "getTicketRound",
        args: [tokenId],
      });

      return data as bigint;
    } catch (error) {
      console.error("Error getting ticket round:", error);
      return undefined;
    }
  };

  /**
   * Get user's ticket count for a specific round
   * @param roundNumber - The round number to get count for
   * @returns Promise that resolves to ticket count or undefined
   */
  const getUserTicketCountForRound = async (roundNumber: bigint): Promise<bigint | undefined> => {
    try {
      const { data } = await useReadContract({
        ...tokenContractData,
        functionName: "getUserTicketCountForRound",
        args: [address || '0x0', roundNumber],
      });

      return data as bigint;
    } catch (error) {
      console.error("Error getting user ticket count for round:", error);
      return undefined;
    }
  };

  // Track transaction status
  const { isLoading: isEntering, isSuccess: hasEntered } = useTransaction({
    hash: txHash,
  });

  return {
    roundInfo,
    currentRound,
    timeUntilEnd,
    userState: userState ? {
      lastParticipation: userState[0],
      participationCount: userState[1]
    } : undefined,
    userTickets,
    userTicketCount,
    isPaused,
    enterLottery,
    setPrizeAmount,
    claimPrize,
    getRoundInfo,
    getTicketRound,
    getUserTicketCountForRound,
    isEntering,
    hasEntered,
    refetchRoundInfo,
  };
}
