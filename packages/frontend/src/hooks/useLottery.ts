import { useEffect, useState, useMemo } from 'react';
import { useAccount, usePublicClient, useReadContract, useTransaction, useWriteContract } from 'wagmi';
import { useLotteryStore } from '@/store/lotteryStore';
import { chainsById, Chain } from '@/lib/chains';
import { LOTTERY_MANAGER_ABI, LOTTERY_TOKEN_ABI } from '@/config/contracts';
import { useRouter } from 'next/navigation';

/**
 * Interface representing basic round information
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
 * Unified hook for lottery functionality
 * Combines contract interactions with global state management
 * 
 * @param chainId - Optional chainId to focus on a specific chain
 * @param updateGlobalChain - Whether to update the global current chain ID (default: false)
 * @returns Object containing lottery data and methods
 */
export function useLottery(chainId?: number, updateGlobalChain: boolean = false) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract } = useWriteContract();
  const router = useRouter();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  
  // Get state and actions from the store
  const { 
    chainState,
    currentChainId: storeChainId,
    currentRoundInfo: storedRoundInfo,
    setLastParticipation,
    setCurrentChainId,
    setCurrentRoundInfo,
    updateTicketCount,
    updateUserTicketCount,
    setPending
  } = useLotteryStore();
  
  // Determine which chain to use
  const targetChainId = chainId || storeChainId;
  
  // Calculate contract addresses and configs (null-safe)
  const { contractAddress, tokenAddress, managerContractData, tokenContractData } = useMemo(() => {
    if (!targetChainId) {
      return {
        contractAddress: undefined,
        tokenAddress: undefined,
        managerContractData: {
          address: '0x0' as `0x${string}`,
          abi: LOTTERY_MANAGER_ABI,
          chainId: 1,
        },
        tokenContractData: {
          address: '0x0' as `0x${string}`,
          abi: LOTTERY_TOKEN_ABI,
          chainId: 1,
        }
      };
    }
    
    const contractAddress = chainsById[targetChainId]?.managerAddress as `0x${string}`;
    const tokenAddress = chainsById[targetChainId]?.tokenAddress as `0x${string}`;
    
    return {
      contractAddress,
      tokenAddress,
      managerContractData: {
        address: contractAddress,
        abi: LOTTERY_MANAGER_ABI,
        chainId: targetChainId,
      },
      tokenContractData: {
        address: tokenAddress,
        abi: LOTTERY_TOKEN_ABI,
        chainId: targetChainId,
      }
    };
  }, [targetChainId]);
  
  // All hooks need to be called unconditionally
  const { data: roundInfoData } = useReadContract({
    ...managerContractData,
    functionName: "getCurrentRoundInfo",
    query: {
      enabled: !!targetChainId && !!contractAddress,
    }
  }) as { data: [bigint, bigint, bigint, bigint, [bigint, bigint, bigint, boolean, `0x${string}`, bigint, boolean, boolean][]] | undefined };

  const { data: currentRound } = useReadContract({
    ...managerContractData,
    functionName: "currentRound",
    query: {
      enabled: !!targetChainId && !!contractAddress,
    }
  });

  const { data: userTickets } = useReadContract({
    ...tokenContractData,
    functionName: "getUserTickets",
    args: [address || '0x0'],
    query: {
      enabled: !!targetChainId && !!tokenAddress && !!address,
    }
  });

  const { data: userTicketCount } = useReadContract({
    ...tokenContractData,
    functionName: "getUserTicketCount",
    args: [address || '0x0'],
    query: {
      enabled: !!targetChainId && !!tokenAddress,
    }
  });

  const { data: isPaused } = useReadContract({
    ...managerContractData,
    functionName: "isPaused",
    query: {
      enabled: !!targetChainId && !!contractAddress,
    }
  });

  const { data: lastParticipation } = useReadContract({
    ...managerContractData,
    functionName: "lastParticipation",
    args: [address || '0x0'],
    query: {
      enabled: !!targetChainId && !!contractAddress,
    }
  });
  
  // Track transaction status
  const { isLoading: isEntering, isSuccess: hasEntered } = useTransaction({
    hash: txHash,
    chainId: targetChainId || undefined
  });
  
  // Format round info data
  const roundInfo: RoundInfo | null = useMemo(() => {
    if (!roundInfoData) return null;
    
    return {
      roundNumber: Number(roundInfoData[0]),
      endTime: Number(roundInfoData[1]),
      ticketCount: Number(roundInfoData[2]),
      userTicketCount: Number(roundInfoData[3]),
      pastRounds: roundInfoData[4].map((round) => ({
        roundNumber: Number(round[0]),
        startTime: Number(round[1]),
        endTime: Number(round[2]),
        isActive: round[3],
        winner: round[4],
        prizeAmount: Number(round[5]),
        prizeSet: round[6],
        prizeClaimed: round[7],
      })),
    };
  }, [roundInfoData]);
  
  // Effects only run if we have valid data
  
  // Update current chain in the store when chainId changes
  // Only update the global chain state if explicitly requested (main UI flow)
  useEffect(() => {
    if (updateGlobalChain && chainId && chainId !== storeChainId) {
      setCurrentChainId(chainId);
    }
  }, [chainId, storeChainId, setCurrentChainId, updateGlobalChain]);
  
  // Update round info in the store when contract data changes
  useEffect(() => {
    if (targetChainId && roundInfo && targetChainId === storeChainId) {
      setCurrentRoundInfo(roundInfo);
    }
  }, [targetChainId, roundInfo, setCurrentRoundInfo, storeChainId]);
  
  // Update lastParticipation in the store when contract data changes
  useEffect(() => {
    if (targetChainId && lastParticipation) {
      setLastParticipation(targetChainId, Number(lastParticipation));
    }
  }, [targetChainId, lastParticipation, setLastParticipation]);
  
  // Watch for LotteryEntry events
  useEffect(() => {
    if (!targetChainId || !publicClient || !address || !contractAddress) return;
    
    const unwatch = publicClient.watchContractEvent({
      address: contractAddress,
      abi: LOTTERY_MANAGER_ABI,
      eventName: 'LotteryEntry',
      onLogs: (logs) => {
        // Check if the event is for the current user
        const userEvents = logs.filter(log => {
          const eventData = log.args as { participant: string; roundNumber: bigint; ticketId: bigint };
          return eventData.participant.toLowerCase() === address.toLowerCase();
        });
        
        if (userEvents.length > 0) {
          // User has entered lottery, update ticket counts
          updateUserTicketCount(targetChainId, userEvents.length);
          updateTicketCount(targetChainId, userEvents.length);
        }
      }
    });
    
    return () => {
      unwatch();
    };
  }, [targetChainId, publicClient, address, contractAddress, updateTicketCount, updateUserTicketCount]);
  
  // Update pending state based on transaction status
  useEffect(() => {
    if (!targetChainId) return;
    
    setPending(targetChainId, isEntering);
  }, [targetChainId, isEntering, setPending]);
  
  /**
   * Enter the current lottery round
   * @returns Promise that resolves to true if successful
   * @throws Error if transaction fails
   */
  const enterLottery = async () => {
    if (!targetChainId || !contractAddress) return false;
    
    try {
      setPending(targetChainId, true);
      
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
      setPending(targetChainId, false);
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
    if (!targetChainId || !contractAddress) return false;
    
    try {
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
   * @returns Object containing round information or undefined
   */
  const getRoundInfo = (roundNumber: bigint) => {
    const { data } = useReadContract({
      ...managerContractData,
      functionName: "getRoundInfo",
      args: [roundNumber],
      query: {
        enabled: !!targetChainId && !!contractAddress,
      }
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
  
  // Return early with minimal data if no chain is selected
  if (!targetChainId) {
    return {
      currentChainId: null,
      roundInfo: null,
      lastParticipation: 0,
      isPending: false,
      enterLottery: async () => false,
      chainState,
      setCurrentChainId,
      claimPrize: async () => false,
      getRoundInfo,
      currentRound: null,
      userTickets: null,
      userTicketCount: null,
      isPaused: null,
      setCurrentRoundInfo,
      setLastParticipation,
    };
  }
  
  return {
    // Chain and contract data
    currentChainId: targetChainId,
    roundInfo: storedRoundInfo || roundInfo,
    currentRound,
    userTickets,
    userTicketCount,
    isPaused,
    lastParticipation: targetChainId ? (chainState[targetChainId]?.lastParticipation || Number(lastParticipation) || 0) : 0,
    isPending: targetChainId ? chainState[targetChainId]?.pending || false : false,
    
    // Contract actions
    enterLottery,
    claimPrize,
    getRoundInfo,
    
    // Global state
    chainState,
    
    // Global state actions
    setCurrentChainId,
    setCurrentRoundInfo,
    setLastParticipation,
  };
}