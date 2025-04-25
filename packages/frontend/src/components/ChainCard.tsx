import Image from 'next/image';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';
import { Chain, chainsById } from '@/lib/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useCountdown from '@/hooks/useCountdown';
import { useLotteryStore } from '@/store/lotteryStore';
import { NetworkStatus } from '@/types';

interface ChainCardProps {
  chain: Chain;
}

const ChainCard: React.FC<ChainCardProps> = ({
  chain,
}) => {
  const { chainId, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { writeContract } = useWriteContract();

  // Get state and actions from the store
  const {
    chainState,
    enterLottery
  } = useLotteryStore();

  // Get last participation time for this chain
  const lastParticipation = chainState[chain.id]?.lastParticipation || 0;

  // Get countdown timer
  const time = useCountdown(Number(lastParticipation) + 60 * 60 * 24, "endTime");

  const handleClick = async () => {
    if (isConnected) {
      if (chainId !== chain.id) {
        await switchChainAsync({ chainId: chain.id });
      } else {
        // Enter lottery using the store action
        await enterLottery(
          chain.id,
          writeContract,
          () => console.log("Entered lottery on chain", chain.name),
          (error) => console.error("Error entering lottery:", error)
        );
      }
    } else {
      openConnectModal?.();
    }
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

  const statusBadge: Record<NetworkStatus, React.ReactNode> = {
    recent: (
      <span className="bg-blue-100 text-blue-600 border border-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
        Recent
      </span>
    ),
    hot: (
      <span className="bg-orange-100 text-orange-600 border border-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
        Hot
      </span>
    ),
    all: null,
  };

  const StatusIndicator = ({ color, text }: { color: "red" | "green"; text: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color === 'red' ? 'bg-red-500' : 'bg-green-500'}`} />
      <p className="text-xs text-gray-500">{text}</p>
    </div>
  );

  const ConnectionStatus = ({ isConnected, time }: { isConnected: boolean; time: string | null }) => {
    if (!isConnected) {
      return <StatusIndicator color="red" text="Not connected" />;
    }

    if (chainsById[chain.id].tokenAddress === undefined || chainsById[chain.id].managerAddress === undefined) {
      return <StatusIndicator color="red" text="Missing Contract" />;
    }

    if (time) {
      return <StatusIndicator color="red" text={time} />;
    }

    return <StatusIndicator color="green" text="Ready" />;
  };

  const isDisabled = () => {
    // User can't participate if they've already participated recently
    // and they're already on the correct chain
    return time !== null && chainId === chain.id;
  };

  // Check if this chain is pending
  const isPending = chainState[chain.id]?.pending || false;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-101 flex flex-col">
      <div className="p-4 border-x border-t border-gray-100 rounded-t-xl flex-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
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
                <div className="w-4 h-4 bg-gray-200 rounded-full" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900 truncate">
                {chain.name}
              </h3>
              {statusBadge[chain.status as keyof typeof statusBadge]}
            </div>
            <ConnectionStatus isConnected={isConnected} time={time} />
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={() => handleClick()}
          disabled={isDisabled() || isPending}
          className={`w-full py-2 px-4 text-sm font-medium transition-colors truncate ${(isDisabled() || isPending) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          style={{
            backgroundColor: chain.iconBackground ?? '#000',
            color: buttonTextColor
          }}
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <div className={`w-4 h-4 animate-spin fill-white fill-${buttonTextColor}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" /></svg>
              </div>
            </div>
          ) : isConnected ? (
            chainId === chain.id ? `GM on ${chain.name}` : `Switch chain`
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChainCard;