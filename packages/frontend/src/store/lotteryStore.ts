import { create } from 'zustand';
import { chains, chainsById } from '@/lib/chains';
import { subscribeWithSelector } from 'zustand/middleware';
import { RoundInfo } from '@/hooks/useLotteryContract';
import type { StateCreator } from 'zustand';

interface ChainLotteryState {
  lastParticipation: number;
  pending: boolean;
}

interface LotteryState {
  // Per-chain state
  chainState: Record<number, ChainLotteryState>;
  
  // Current chain state
  currentChainId: number | null;
  currentRoundInfo: RoundInfo | null;
  
  // Actions
  setLastParticipation: (chainId: number, timestamp: number) => void;
  setCurrentChainId: (chainId: number | null) => void;
  setCurrentRoundInfo: (roundInfo: RoundInfo | null) => void;
  updateTicketCount: (chainId: number, incrementBy?: number) => void;
  updateUserTicketCount: (chainId: number, incrementBy?: number) => void;
  setPending: (chainId: number, isPending: boolean) => void;
  reset: () => void;
}

// Create initial chain state for all supported chains
const createInitialChainState = (): Record<number, ChainLotteryState> => {
  const initialState: Record<number, ChainLotteryState> = {};
  
  chains.forEach(chain => {
    initialState[chain.id] = {
      lastParticipation: 0,
      pending: false
    };
  });
  
  return initialState;
};

export const useLotteryStore = create<LotteryState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    chainState: createInitialChainState(),
    currentChainId: null,
    currentRoundInfo: null,
    
    // Actions
    setLastParticipation: (chainId: number, timestamp: number) => 
      set((state: LotteryState) => ({
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
      
    setCurrentRoundInfo: (roundInfo: RoundInfo | null) => 
      set({ currentRoundInfo: roundInfo }),
      
    updateTicketCount: (chainId: number, incrementBy = 1) => {
      const state = get();
      if (state.currentChainId === chainId && state.currentRoundInfo) {
        set({
          currentRoundInfo: {
            ...state.currentRoundInfo,
            ticketCount: state.currentRoundInfo.ticketCount + incrementBy
          }
        });
      }
    },
    
    updateUserTicketCount: (chainId: number, incrementBy = 1) => {
      const state = get();
      if (state.currentChainId === chainId && state.currentRoundInfo) {
        set({
          currentRoundInfo: {
            ...state.currentRoundInfo,
            userTicketCount: state.currentRoundInfo.userTicketCount + incrementBy
          }
        });
      }
    },
    
    setPending: (chainId: number, isPending: boolean) => 
      set((state: LotteryState) => ({
        chainState: {
          ...state.chainState,
          [chainId]: {
            ...state.chainState[chainId],
            pending: isPending
          }
        }
      })),
    
    reset: () => set({
      chainState: createInitialChainState(),
      currentChainId: null,
      currentRoundInfo: null
    })
  }))
); 