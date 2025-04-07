import { useAccount, useSwitchChain } from 'wagmi';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useState } from 'react';

export const useNetwork = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);

  const handleNetworkConnect = async (chainId: number) => {
    try {
      setIsLoading(true);
      if (isConnected) {
        await switchChain({ chainId });
        // TODO: Call contract for GM
        // TODO: Set toast to show GM sent
        console.log(`GM sent on chain ${chainId}`);
      } else {
        openConnectModal?.();
      }
    } catch (error) {
      console.error('Error connecting to network:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    handleNetworkConnect,
  };
}; 