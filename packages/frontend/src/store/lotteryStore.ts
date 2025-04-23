import { create } from 'zustand';
import { chains, chainsById } from '@/lib/chains';
import { subscribeWithSelector } from 'zustand/middleware';
import { LOTTERY_MANAGER_ABI, LOTTERY_TOKEN_ABI } from '@/config/contracts';
import type { PublicClient, Log, TransactionReceipt } from 'viem';
// import { Chain } from '@/lib/chains';

type Address = `0x${string}`;

// Contract write return type
type WriteContractReturnType = Address;

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
    winner: Address;
    prizeAmount: number;
    prizeSet: boolean;
    prizeClaimed: boolean;
  }[];
}

interface ChainLotteryState {
  lastParticipation: number;
  pending: boolean;
  roundInfo: RoundInfo | null;
  watcherActive: boolean;
}

interface LotteryState {
  // Per-chain state
  chainState: Record<number, ChainLotteryState>;
  
  // Current chain state
  currentChainId: number | null;
  
  // Actions
  setLastParticipation: (chainId: number, timestamp: number) => void;
  setCurrentChainId: (chainId: number | null) => void;
  setCurrentRoundInfo: (chainId: number, roundInfo: RoundInfo | null) => void;
  updateTicketCount: (chainId: number, incrementBy?: number) => void;
  updateUserTicketCount: (chainId: number, incrementBy?: number) => void;
  setPending: (chainId: number, isPending: boolean) => void;
  setWatcherActive: (chainId: number, isActive: boolean) => void;
  setupEventWatcher: (
    chainId: number, 
    publicClient: PublicClient, 
    userAddress: Address,
    onTicketUpdate?: () => void
  ) => () => void;
  
  // Contract interactions
  enterLottery: (
    chainId: number, 
    writeContract: (config: any) => any,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => Promise<boolean>;
  
  claimPrize: (
    chainId: number, 
    roundNumber: bigint, 
    writeContract: (config: any) => any,
    onSuccess?: () => void, 
    onError?: (error: Error) => void
  ) => Promise<boolean>;
  
  // Helpers
  getCurrentRoundInfo: (chainId: number) => RoundInfo | null;
  reset: () => void;
}

// Create initial chain state for all supported chains
const createInitialChainState = (): Record<number, ChainLotteryState> => {
  const initialState: Record<number, ChainLotteryState> = {};
  
  chains.forEach(chain => {
    initialState[chain.id] = {
      lastParticipation: 0,
      pending: false,
      roundInfo: null,
      watcherActive: false
    };
  });
  
  return initialState;
};

export const useLotteryStore = create<LotteryState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    chainState: createInitialChainState(),
    currentChainId: null,
    
    // Actions
    setLastParticipation: (chainId: number, timestamp: number) => 
      set((state) => ({
        chainState: {
          ...state.chainState,
          [chainId]: {
            ...state.chainState[chainId],
            lastParticipation: timestamp
          }
        }
      })),
      
    setCurrentChainId: (chainId: number | null) => 
      set({ currentChainId: chainId }),
      
    setCurrentRoundInfo: (chainId: number, roundInfo: RoundInfo | null) => 
      set((state) => ({
        chainState: {
          ...state.chainState,
          [chainId]: {
            ...state.chainState[chainId],
            roundInfo
          }
        }
      })),
      
    updateTicketCount: (chainId: number, incrementBy = 1) => {
      const state = get();
      const roundInfo = state.chainState[chainId]?.roundInfo;
      
      if (roundInfo) {
        set((state) => ({
          chainState: {
            ...state.chainState,
            [chainId]: {
              ...state.chainState[chainId],
              roundInfo: {
                ...roundInfo,
                ticketCount: roundInfo.ticketCount + incrementBy
              }
            }
          }
        }));
      }
    },
    
    updateUserTicketCount: (chainId: number, incrementBy = 1) => {
      const state = get();
      const roundInfo = state.chainState[chainId]?.roundInfo;
      
      if (roundInfo) {
        set((state) => ({
          chainState: {
            ...state.chainState,
            [chainId]: {
              ...state.chainState[chainId],
              roundInfo: {
                ...roundInfo,
                userTicketCount: roundInfo.userTicketCount + incrementBy
              }
            }
          }
        }));
      }
    },
    
    setPending: (chainId: number, isPending: boolean) => 
      set((state) => ({
        chainState: {
          ...state.chainState,
          [chainId]: {
            ...state.chainState[chainId],
            pending: isPending
          }
        }
      })),
      
    setWatcherActive: (chainId: number, isActive: boolean) => 
      set((state) => ({
        chainState: {
          ...state.chainState,
          [chainId]: {
            ...state.chainState[chainId],
            watcherActive: isActive
          }
        }
      })),
    
    setupEventWatcher: (chainId: number, publicClient, userAddress, onTicketUpdate) => {
      const state = get();
      
      // Don't setup duplicate watchers
      if (state.chainState[chainId]?.watcherActive) {
        return () => {}; // Return no-op cleanup function
      }
      
      const contractAddress = chainsById[chainId]?.managerAddress;
      if (!contractAddress) {
        return () => {};
      }
      
      // Mark watcher as active for this chain
      get().setWatcherActive(chainId, true);
      
      const unwatch = publicClient.watchContractEvent({
        address: contractAddress,
        abi: LOTTERY_MANAGER_ABI,
        eventName: 'LotteryEntry',
        onLogs: (logs: Log[]) => {
          // Check if the event is for the current user
          const userEvents = logs.filter((log: Log) => {
            // Using type assertion for contract event args
            const eventData = (log as any).args as { participant: string; roundNumber: bigint; ticketId: bigint };
            return eventData.participant.toLowerCase() === userAddress.toLowerCase();
          });
          
          if (userEvents.length > 0) {
            // User has entered lottery, update ticket counts
            get().updateUserTicketCount(chainId, userEvents.length);
            get().updateTicketCount(chainId, userEvents.length);
            
            // Call optional callback for UI refresh
            if (onTicketUpdate) {
              onTicketUpdate();
            }
          }
        }
      });
      
      // Return cleanup function
      return () => {
        unwatch();
        get().setWatcherActive(chainId, false);
      };
    },
    
    enterLottery: async (chainId, writeContract, onSuccess, onError) => {
      try {
        const contractAddress = chainsById[chainId]?.managerAddress as `0x${string}`;
        if (!contractAddress) {
          throw new Error(`No contract address found for chain ${chainId}`);
        }
        
        // Set pending state
        get().setPending(chainId, true);
        
        const txHash = writeContract({
          address: contractAddress,
          abi: LOTTERY_MANAGER_ABI,
          functionName: "enterLottery",
          chainId,
          gas: BigInt(1000000),
        });
        
        // Call success callback with the transaction hash
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      } catch (error) {
        console.error("Error entering lottery:", error);
        get().setPending(chainId, false);
        
        if (onError && error instanceof Error) {
          onError(error);
        }
        
        return false;
      }
    },
    
    claimPrize: async (chainId, roundNumber, writeContract, onSuccess, onError) => {
      try {
        const contractAddress = chainsById[chainId]?.managerAddress as `0x${string}`;
        if (!contractAddress) {
          throw new Error(`No contract address found for chain ${chainId}`);
        }
        
        const txHash = writeContract({
          address: contractAddress,
          abi: LOTTERY_MANAGER_ABI,
          functionName: "claimPrize",
          args: [roundNumber],
          chainId,
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      } catch (error) {
        console.error("Error claiming prize:", error);
        
        if (onError && error instanceof Error) {
          onError(error);
        }
        
        return false;
      }
    },
    
    getCurrentRoundInfo: (chainId: number) => {
      return get().chainState[chainId]?.roundInfo || null;
    },
    
    reset: () => set({
      chainState: createInitialChainState(),
      currentChainId: null
    })
  }))
); 