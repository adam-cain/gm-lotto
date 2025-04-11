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
 * @property startTime - Unix timestamp when the round started
 * @property endTime - Unix timestamp when the round ends
 * @property ticketCount - Number of tickets in the current round
 * @property isActive - Whether the round is currently active
 * @property formattedStartTime - Formatted start time as Date object
 * @property formattedEndTime - Formatted end time as Date object
 */
export interface RoundInfo {
  roundNumber: bigint;
  startTime: bigint;
  endTime: bigint;
  ticketCount: bigint;
  isActive: boolean;
  formattedStartTime: Date;
  formattedEndTime: Date;
}

/**
 * Interface representing detailed round information
 * @property startTime - Unix timestamp when the round started
 * @property endTime - Unix timestamp when the round ends
 * @property ticketIds - Array of ticket IDs in this round
 * @property isActive - Whether the round is currently active
 * @property winner - Address of the round winner
 * @property prizeAmount - Amount of prize in wei
 * @property prizeSet - Whether the prize has been set
 * @property prizeClaimed - Whether the prize has been claimed
 * @property formattedStartTime - Formatted start time as Date object
 * @property formattedEndTime - Formatted end time as Date object
 * @property formattedPrizeAmount - Formatted prize amount in ether
 */
export interface FullRoundInfo {
  startTime: bigint;
  endTime: bigint;
  ticketIds: bigint[];
  isActive: boolean;
  winner: `0x${string}`;
  prizeAmount: bigint;
  prizeSet: boolean;
  prizeClaimed: boolean;
  formattedStartTime: Date;
  formattedEndTime: Date;
  formattedPrizeAmount: string;
}

/**
 * Interface representing ticket information
 * @property tokenId - Unique identifier of the ticket
 * @property roundNumber - Round number the ticket belongs to
 * @property owner - Address of the ticket owner
 */
export interface TicketInfo {
  tokenId: bigint;
  roundNumber: bigint;
  owner: `0x${string}`;
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
  }) as { data: [bigint, bigint, bigint, bigint, boolean] | undefined; refetch: () => void };  

  // Format round information with timestamps
  const roundInfo: RoundInfo | undefined = rawRoundInfo ? {
    roundNumber: rawRoundInfo[0],
    startTime: rawRoundInfo[1],
    endTime: rawRoundInfo[2],
    ticketCount: rawRoundInfo[3],
    isActive: rawRoundInfo[4],
    formattedStartTime: new Date(Number(rawRoundInfo[1]) * 1000),
    formattedEndTime: new Date(Number(rawRoundInfo[2]) * 1000)
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

  // Get user's last participation timestamp
  const { data: lastParticipationTimestamp } = useReadContract({
    ...contractData,
    functionName: "lastParticipationTimestamp",
    args: [address || '0x0'],
  });

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
      });

      if (!data) return undefined;

      const [
        startTime,
        endTime,
        ticketIds,
        isActive,
        winner,
        prizeAmount,
        prizeSet,
        prizeClaimed
      ] = data as [bigint, bigint, bigint[], boolean, `0x${string}`, bigint, boolean, boolean];

      return {
        startTime,
        endTime,
        ticketIds,
        isActive,
        winner,
        prizeAmount,
        prizeSet,
        prizeClaimed,
        formattedStartTime: new Date(Number(startTime) * 1000),
        formattedEndTime: new Date(Number(endTime) * 1000),
        formattedPrizeAmount: formatEther(prizeAmount),
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
   * Get user's tickets for a specific round
   * @param roundNumber - The round number to get tickets for
   * @returns Promise that resolves to array of ticket IDs or undefined
   */
  const getUserTicketsForRound = async (roundNumber: bigint): Promise<bigint[] | undefined> => {
    try {
      const { data } = await useReadContract({
        ...tokenContractData,
        functionName: "getUserTicketsForRound",
        args: [address || '0x0', roundNumber],
      });

      return data as bigint[];
    } catch (error) {
      console.error("Error getting user tickets for round:", error);
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
    lastParticipationTimestamp,
    userTickets,
    userTicketCount,
    isPaused,
    enterLottery,
    setPrizeAmount,
    claimPrize,
    getRoundInfo,
    getTicketRound,
    getUserTicketsForRound,
    isEntering,
    hasEntered,
    refetchRoundInfo,
  };
}
