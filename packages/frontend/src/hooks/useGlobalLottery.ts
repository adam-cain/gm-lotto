import { useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { useLotteryStore } from '@/store/lotteryStore';
import { useLotteryContract } from './useLotteryContract';
import { chainsById } from '@/lib/chains';
import { LOTTERY_MANAGER_ABI } from '@/config/contracts';

/**
 * Hook for global lottery state management
 * Connects contract data to the global state store
 * 
 * @param chainId - Optional chainId to focus on a specific chain
 * @returns Object containing global lottery state and actions
 */
export function useGlobalLottery(chainId?: number) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  
  // Get state and actions from the store
  const { 
    chainState,
    currentChainId,
    currentRoundInfo,
    setLastParticipation,
    setCurrentChainId,
    setCurrentRoundInfo,
    updateTicketCount,
    updateUserTicketCount,
    setPending
  } = useLotteryStore();
  
  // If a chainId is provided, use it, otherwise use the current chain from the store
  const targetChainId = chainId || currentChainId;
  
  // Use lottery contract hook for the current chain
  const {
    roundInfo,
    lastParticipation,
    enterLottery,
    isEntering,
    hasEntered,
  } = targetChainId ? useLotteryContract(targetChainId) : { 
    roundInfo: null, 
    lastParticipation: null,
    enterLottery: async () => false,
    isEntering: false,
    hasEntered: false,
  };
  
  // Update current chain in the store when chainId changes
  useEffect(() => {
    if (chainId && chainId !== currentChainId) {
      setCurrentChainId(chainId);
    }
  }, [chainId, currentChainId, setCurrentChainId]);
  
  // Update round info in the store when contract data changes
  useEffect(() => {
    if (targetChainId && roundInfo) {
      setCurrentRoundInfo(roundInfo);
    }
  }, [targetChainId, roundInfo, setCurrentRoundInfo]);
  
  // Update lastParticipation in the store when contract data changes
  useEffect(() => {
    if (targetChainId && lastParticipation) {
      setLastParticipation(targetChainId, Number(lastParticipation));
    }
  }, [targetChainId, lastParticipation, setLastParticipation]);
  
  // Watch for LotteryEntry events
  useEffect(() => {
    if (!targetChainId || !publicClient || !address) return;
    
    const contractAddress = chainsById[targetChainId]?.managerAddress;
    if (!contractAddress) return;
    
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
  }, [targetChainId, publicClient, address, updateTicketCount, updateUserTicketCount]);
  
  // Update pending state based on transaction status
  useEffect(() => {
    if (!targetChainId) return;
    
    setPending(targetChainId, isEntering);
    
    // If the transaction was successful, update lastParticipation
    if (hasEntered && !isEntering) {
      // Force refresh the lastParticipation value from the contract
      // This would be handled by a refetch in a real implementation
    }
  }, [targetChainId, isEntering, hasEntered, setPending]);
  
  // Enhanced enterLottery function that updates the store
  const enterLotteryWithUpdates = async () => {
    if (!targetChainId) return false;
    
    try {
      setPending(targetChainId, true);
      const result = await enterLottery();
      
      if (result) {
        // Optional: you can optimistically update state here
        // instead of waiting for the event
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error entering lottery:', error);
      setPending(targetChainId, false);
      return false;
    }
  };
  
  return {
    // Current chain state
    currentChainId: targetChainId,
    roundInfo: currentRoundInfo,
    lastParticipation: targetChainId ? chainState[targetChainId]?.lastParticipation : 0,
    isPending: targetChainId ? chainState[targetChainId]?.pending : false,
    
    // All chains state
    chainState,
    
    // Actions
    enterLottery: enterLotteryWithUpdates,
    
    // Store actions for advanced usage
    setCurrentChainId,
    setCurrentRoundInfo,
    setLastParticipation,
  };
} 