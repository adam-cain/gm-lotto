import {
  useReadContract,
  useWriteContract,
  useSwitchChain,
  useTransaction,
  useAccount,
} from "wagmi";
import {
  LOTTERY_MANAGER_ABI,
  LOTTERY_TOKEN_ABI,
} from "../config/contracts";
import { useState } from "react";
import { chainsById } from "@/lib/chains";
import { useRouter } from "next/navigation";

/**
 * Interface representing basic round information
 * @property roundNumber - The current round number
 * @property endTime - Unix timestamp when the round ends
 * @property ticketCount - Number of tickets in the current round
 * @property userTicketCount - Number of tickets owned by the user
 * @property pastRounds - Array of past round information
 */
export interface RoundInfo {
  roundNumber: number;
  endTime: number;
  ticketCount: number;
  userTicketCount: number;
  pastRounds: readonly {
    roundNumber: number;
    startTime: number;
    endTime: number;
    isActive: boolean;
    winner: `0x${string}`;
    prizeAmount: number;
    prizeSet: boolean;
    prizeClaimed: boolean;
  }[];
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
interface FullRoundInfo {
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
 * Custom hook for interacting with the GM Lottery contract
 * @param chainId - The chain ID where the contract is deployed
 * @returns Object containing contract interaction methods and state
 */
export function useLotteryContract(chainId: number) {
  // const { switchChain } = useSwitchChain();
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const router = useRouter();

  const contractAddress = chainsById[chainId]?.managerAddress as `0x${string}`;
  const tokenAddress = chainsById[chainId]?.tokenAddress as `0x${string}`;

  // Contract configuration for lottery manager
  const managerContractData = {
    address: contractAddress,
    abi: LOTTERY_MANAGER_ABI,
    chainId: chainId,
  }

  // Contract configuration for NFT token
  const tokenContractData = {
    address: tokenAddress,
    abi: LOTTERY_TOKEN_ABI,
    chainId: chainId,
  }

  // Get current round information
  const { data: roundInfoData } = useReadContract({
    ...managerContractData,
    functionName: "getCurrentRoundInfo",
  }) as { data: [bigint, bigint, bigint, bigint, [bigint, bigint, bigint, boolean, `0x${string}`, bigint, boolean, boolean][]] | undefined, refetch: () => void };

  const roundInfo: RoundInfo | null = roundInfoData ? {
    roundNumber: Number(roundInfoData?.[0]),
    endTime: Number(roundInfoData?.[1]),
    ticketCount: Number(roundInfoData?.[2]),
    userTicketCount: Number(roundInfoData?.[3]),
    pastRounds: roundInfoData?.[4].map((round) => ({
      roundNumber: Number(round[0]),
      startTime: Number(round[1]),
      endTime: Number(round[2]),
      isActive: round[3],
      winner: round[4],
      prizeAmount: Number(round[5]),
      prizeSet: round[6],
      prizeClaimed: round[7],
    })),
  } : null;

  // Get current round number
  const { data: currentRound } = useReadContract({
    ...managerContractData,
    functionName: "currentRound",
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
    ...managerContractData,
    functionName: "isPaused",
  });

  // Get user's last participation time
  const { data: lastParticipation } = useReadContract({
    ...managerContractData,
    functionName: "lastParticipation",
    args: [address || '0x0'],
  });

  /**
   * Enter the current lottery round
   * @returns Promise that resolves to true if successful
   * @throws Error if transaction fails
   */
  const enterLottery = async () => {
    try {
      // Switch to the correct chain first
      // switchChain({
      //   chainId: chainId,
      // });
      
      const result = writeContract({
        ...managerContractData,
        functionName: "enterLottery",
        gas: BigInt(1000000),
      });
      
      setTxHash(result as unknown as `0x${string}`);
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error entering lottery:", error);
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
      // await switchChain({
      //   chainId: chainId,
      // });

      const result = await writeContract({
        ...managerContractData,
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
  const useRoundInfo = (roundNumber: bigint): { data: FullRoundInfo | undefined } => {
    const { data } = useReadContract({
      ...managerContractData,
      functionName: "getRoundInfo",
      args: [roundNumber],
    }) as { data: [bigint, bigint, bigint, bigint, boolean, `0x${string}`, bigint, boolean, boolean] | undefined };

    if (!data) return { data: undefined };

    return {
      data: {
        startTime: data[0],
        endTime: data[1],
        roundTicketCount: data[2],
        userRoundTicketCount: data[3],
        isActive: data[4],
        winner: data[5],
        prizeAmount: data[6],
        prizeSet: data[7],
        prizeClaimed: data[8]
      }
    };
  };

  /**
   * Get the round number for a specific ticket
   * @param tokenId - The ticket ID to check
   * @returns The round number or undefined
   */
  const useTicketRound = (tokenId: bigint) => {
    return useReadContract({
      ...tokenContractData,
      functionName: "getTicketRound",
      args: [tokenId],
    });
  };

  /**
   * Get user's ticket count for a specific round
   * @param roundNumber - The round number to get count for
   * @returns The ticket count or undefined
   */
  const useUserTicketCountForRound = (roundNumber: bigint) => {
    return useReadContract({
      ...tokenContractData,
      functionName: "getUserTicketCountForRound",
      args: [address || '0x0', roundNumber],
    });
  };
  
  // Track transaction status
  const { isLoading: isEntering, isSuccess: hasEntered } = useTransaction({
    hash: txHash,
    chainId: chainId
  });

  return {
    roundInfo,
    currentRound,
    userTickets,
    userTicketCount,
    isPaused,
    lastParticipation,
    enterLottery,
    claimPrize,
    useRoundInfo,
    useTicketRound,
    useUserTicketCountForRound,
    isEntering,
    hasEntered,
    // refetchRoundInfo,
  };
}

