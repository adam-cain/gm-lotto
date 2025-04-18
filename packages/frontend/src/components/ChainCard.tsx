import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useLotteryContract } from '@/hooks/useLotteryContract';
import { Chain, chainsById } from '@/lib/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useCountdown from '@/hooks/useCountdown';

interface ChainCardProps {
  chain: Chain;
  isConnected: boolean;
}

const ChainCard: React.FC<ChainCardProps> = ({
  chain,
  isConnected,
}) => {
  const { enterLottery, lastParticipation, refetchRoundInfo } = useLotteryContract(chain.id);
  const { chainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const account = useAccount();
  const time = useCountdown(Number(lastParticipation) + 60 * 60 * 24, "endTime");

  const handleClick = async () => {
    if (isConnected) {
      enterLottery();
    } else {
      openConnectModal?.();
    }
    refetchRoundInfo();
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

  const StatusIndicator = ({ color, text }: { color: string; text: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-red-500'}`} />
      <p className="text-xs text-gray-500">{text}</p>
    </div>
  );

  const ConnectionStatus = ({ isConnected, time }: { isConnected: boolean; time: string | null }) => {
    if (!isConnected) {
      return <StatusIndicator color="red" text="Not connected" />;
    }

    if(chainsById[chain.id].tokenAddress === undefined || chainsById[chain.id].managerAddress === undefined) {
      return <StatusIndicator color="red" text="Missing Contract" />;
    }

    if (time) {
      return <StatusIndicator color="red" text={time} />;
    }

    return <StatusIndicator color="green" text="Ready" />;
  };

  const isDisabled = () => {
    return (
      time !== null && chainId === chain.id
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-101">
      <div className="p-4 border-x border-t border-gray-100 rounded-t-xl ">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden  flex-shrink-0 border border-gray-100">
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
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 truncate">
                {chain.name}
              </h3>
              {statusBadge[chain.status as keyof typeof statusBadge]}
            </div>
            <ConnectionStatus isConnected={account.isConnected} time={time} />
          </div>
        </div>
      </div>
      <div className="">
        <button
          onClick={() => handleClick()}
          disabled={isDisabled()}
          className={`w-full py-2 px-4 text-sm font-medium transition-colors truncate ${isDisabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          style={{
            backgroundColor: chain.iconBackground ?? '#000',
            color: buttonTextColor
          }}
        >
          {isConnected ? (
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

