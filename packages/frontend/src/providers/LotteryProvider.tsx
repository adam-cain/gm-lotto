import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAccount, usePublicClient, useReadContract, useWriteContract } from 'wagmi';
import { useLotteryStore } from '@/store/lotteryStore';
import { chainsById } from '@/lib/chains';
import { LOTTERY_MANAGER_ABI } from '@/config/contracts';
import { Address, RoundInfo } from '@/types';
// Create context with an empty default value
const LotteryContext = createContext<ReturnType<typeof useLotteryData>>({
  currentChainId: null,
  roundInfo: null,
  lastParticipation: 0,
  isPending: false,
  enterLottery: async () => false,
  claimPrize: async () => false,
});

// Custom hook to access the lottery data
export const useLotteryContext = () => useContext(LotteryContext);

/**
 * Hook that pulls data from the store and contracts
 * Internal hook only used by the provider
 */
function useLotteryData() {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract } = useWriteContract();

  // Get state and actions from the store
  const {
    chainState,
    currentChainId: storeChainId,
    setCurrentChainId,
    setCurrentRoundInfo,
    setupEventWatcher,
    enterLottery: storeEnterLottery,
    claimPrize: storeClaimPrize,
    reset
  } = useLotteryStore();

  // Use current wallet chain if available, otherwise use store's current chain
  const currentChainId = chainId || storeChainId;

  // Only continue if we have a chain ID
  const contractAddress = currentChainId ? chainsById[currentChainId]?.managerAddress : undefined;

  // Get round info from contract if we have a chain and contract address
  const { data: roundInfoData, refetch: refetchRoundInfo } = useReadContract({
    address: contractAddress,
    abi: LOTTERY_MANAGER_ABI,
    functionName: "getCurrentRoundInfo",
    chainId: currentChainId ? currentChainId : undefined,
    query: {
      enabled: !!currentChainId && !!contractAddress,
    },
    account: address,
  })  

  // Get user's last participation time
  const { data: lastParticipation } = useReadContract({
    address: contractAddress,
    abi: LOTTERY_MANAGER_ABI,
    functionName: "lastParticipation",
    args: [address || '0x0'],
    chainId: currentChainId ? currentChainId : undefined,
    query: {
      enabled: !!currentChainId && !!contractAddress && !!address,
    },
    account: address,
  });

  // Set up current chain in the store
  useEffect(() => {
    if (chainId && chainId !== storeChainId) {
      setCurrentChainId(chainId);
    }
  }, [chainId, storeChainId, setCurrentChainId]);

  useEffect(() => {
    reset()
  }, [address, reset]);

  // Update round info in the store when contract data changes
  useEffect(() => {
    if (currentChainId && roundInfoData) {
      const formattedRoundInfo: RoundInfo = {
        roundNumber: Number(roundInfoData[0]),
        startTime: Number(roundInfoData[1]),
        ticketCount: Number(roundInfoData[2]),
        userTicketCount: Number(roundInfoData[3]),
        pastRounds: roundInfoData[4].map((round) => ({
          roundNumber: Number(round.roundNumber),
          startTime: Number(round.startTime),
          isActive: round.isActive,
          prizeSet: round.prizeSet,
          prizeClaimed: round.prizeClaimed,
          winner: round.winner as Address,
          prizeAmount: Number(round.prizeAmount),
          winningTicketId: Number(round.winningTicketId),
          firstTokenId: Number(round.firstTokenId),
        })),
      };
      
      setCurrentRoundInfo(currentChainId, formattedRoundInfo);
    }
  }, [currentChainId, roundInfoData, setCurrentRoundInfo]);

  // Set up event watcher
  useEffect(() => {
    if (!currentChainId || !publicClient || !address || !contractAddress) return;

    const cleanupWatcher = setupEventWatcher(currentChainId, publicClient, address, () => {
      // Refresh data when events are detected
      refetchRoundInfo();
    });

    return cleanupWatcher;
  }, [currentChainId, publicClient, address, contractAddress, setupEventWatcher, refetchRoundInfo]);

  // Get current round info from store
  const roundInfo = currentChainId
    ? chainState[currentChainId]?.roundInfo
    : null;

  // Get isPending status
  const isPending = currentChainId
    ? chainState[currentChainId]?.pending || false
    : false;

  // Get last participation time
  const lastParticipationTime = currentChainId
    ? chainState[currentChainId]?.lastParticipation || Number(lastParticipation || 0)
    : 0;

  // Wrapper for enterLottery
  const enterLotteryFn = async () => {
    if (!currentChainId) return false;

    return storeEnterLottery(
      currentChainId,
      writeContract,
      () => {
        // Success callback - refresh data
        refetchRoundInfo();
      },
      (error) => {
        console.error("Failed to enter lottery:", error);
      }
    );
  };

  // Wrapper for claimPrize
  const claimPrizeFn = async (roundNumber: bigint) => {
    if (!currentChainId) return false;

    return storeClaimPrize(
      currentChainId,
      roundNumber,
      writeContract,
      () => {
        // Success callback - refresh data
        refetchRoundInfo();
      },
      (error) => {
        console.error("Failed to claim prize:", error);
      }
    );
  };

  return {
    currentChainId,
    roundInfo,
    lastParticipation: lastParticipationTime,
    isPending,
    enterLottery: enterLotteryFn,
    claimPrize: claimPrizeFn,
  };
}

interface LotteryProviderProps {
  children: ReactNode;
}

/**
 * Provider component that makes lottery data available
 * to all child components
 */
export function LotteryProvider({ children }: LotteryProviderProps) {
  const lotteryData = useLotteryData();

  return (
    <LotteryContext.Provider value={lotteryData}>
      {children}
    </LotteryContext.Provider>
  );
} 