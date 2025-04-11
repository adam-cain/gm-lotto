import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useLotteryContract } from '@/hooks/useLotteryContract';
import { Chain } from '@/lib/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { useSwitchChain } from 'wagmi';
import useCountdown from '@/hooks/useCountdown';

interface ChainCardProps {
  chain: Chain;
  isConnected: boolean;
}

const ChainCard: React.FC<ChainCardProps> = ({
  chain,
  isConnected,
}) => {
  const { enterLottery, lastParticipationTimestamp } = useLotteryContract(chain.id, chain.contractAddress || '0x0');
  const { chainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  // unix timestamp for 24 hours from now
  const endTime = Number(lastParticipationTimestamp) + 60 * 60 * 24
  const time = useCountdown(endTime);

  if (chain.id === 11155420) {
    console.log("time:", endTime, time);
  }

  const handleClick = async () => {
    setIsLoading(true);
    if (isConnected) {
      if (chainId !== chain.id) {
        switchChain({
          chainId: chain.id,
        });
        let interval = setInterval(() => {
          if (chainId !== chain.id) {
            clearInterval(interval);
          }
        }, 1000);
      }

      await enterLottery();
    } else {
      openConnectModal?.();
    }
    setIsLoading(false);
  }

  const buttonTextColor = chain.iconBackground
    ? (() => {
      // Remove the hash if it exists
      const hex = chain.iconBackground.replace('#', '');

      // Convert hex to RGB
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Calculate luminance - determines if color is light or dark
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Return black for light colors, white for dark colors
      return luminance > 0.5 ? 'black' : 'white';
    })()
    : 'white'; // Default to white text if no color specified

  const statusBadge = {
    hot: (
      <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
        Hot
      </span>
    ),
    new: (
      <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
        New
      </span>
    ),
    regular: null,
  };

  return (
    <div className="bg-white  rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100  flex-shrink-0">
            {chain.iconUrl ? (
              <Image
                width={40}
                height={40}
                src={chain.iconUrl ? (typeof chain.iconUrl === 'string' ? chain.iconUrl : '/images/chains/optimism.svg') : '/images/chains/optimism.svg'}
                alt={`${chain.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, use a fallback
                  (e.target as HTMLImageElement).src = '/images/chains/optimism.svg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200  rounded-full" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900  truncate">
                {chain.name}
              </h3>
              {statusBadge[chain.status as keyof typeof statusBadge]}
            </div>
            {time ?
              <div className="flex items-center allign-middle gap-2">
                <div className={`w-2 h-2 rounded-full bg-red-500`} />
                <p className="text-xs text-gray-500 ">
                  {time}
                </p>
              </div>
              :
              <div className="flex items-center allign-middle gap-2">
                <div className={`w-2 h-2 rounded-full bg-green-500`} />
                <p className="text-xs text-gray-500 ">
                  Ready
                </p>
              </div>
            }
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={() => handleClick()}
          disabled={isLoading || time !== null}
          className={`w-full py-2 px-4 text-sm font-medium rounded-lg transition-colors hover:cursor-pointer truncate ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          style={{
            backgroundColor: chain.iconBackground ?? '#000',
            color: buttonTextColor
          }}
        >
          {isLoading ? (
            'Connecting...'
          ) : isConnected ? (
            chainId === chain.id ? `GM on ${chain.name}` : `Switch to ${chain.name}`
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChainCard;
