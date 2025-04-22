import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useLottery } from '@/hooks/useLottery';
import { useLotteryStore } from '@/store/lotteryStore';

// Create context with default values
const LotteryContext = createContext<ReturnType<typeof useLottery> | undefined>(undefined);

// Custom hook for accessing the lottery context
export const useLotteryContext = () => {
  const context = useContext(LotteryContext);
  if (context === undefined) {
    throw new Error('useLotteryContext must be used within a LotteryProvider');
  }
  return context;
};

interface LotteryProviderProps {
  children: ReactNode;
  chainId?: number;
}

// Provider component
export const LotteryProvider: React.FC<LotteryProviderProps> = ({ 
  children, 
  chainId 
}) => {
  const { address, chainId: connectedChainId } = useAccount();
  const reset = useLotteryStore((state: { reset: () => void }) => state.reset);
  
  // Use the provided chainId or fall back to the connected chain
  const effectiveChainId = chainId || (connectedChainId as number);
  
  // Get lottery state using our custom hook - enable updateGlobalChain since this is the main provider
  const lotteryState = useLottery(effectiveChainId, true);
  
  // Reset store when user disconnects wallet
  useEffect(() => {
    if (!address) {
      console.log("Resetting lottery state");
      reset();
    }
  }, [address, reset]);
  
  return (
    <LotteryContext.Provider value={lotteryState}>
      {children}
    </LotteryContext.Provider>
  );
};

// Default export for easy importing
export default LotteryProvider; 