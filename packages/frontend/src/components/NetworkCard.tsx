import Image from 'next/image';
import { NetworkCardProps } from '@/types/network';
import { useAccount } from 'wagmi';

const NetworkCard: React.FC<NetworkCardProps> = ({
  network,
  isConnected,
  onConnect,
  isLoading = false,
}) => {
  const { chainId } = useAccount();
  const { name, image, status, color } = network;

  const buttonTextColor = color
    ? (() => {
        // Remove the hash if it exists
        const hex = color.replace('#', '');
        
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {image ? (
            <Image
              width={40}
              height={40}
              src={image}
              alt={`${name} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, use a fallback
                (e.target as HTMLImageElement).src = '/images/chains/optimism.svg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {name}
              </h3>
              {statusBadge[status]}
            </div>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">
              Connect wallet to GM
            </p> */}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={() => onConnect(network.chainId)}
          disabled={isLoading}
          className={`w-full py-2 px-4 text-sm font-medium rounded-lg transition-colors hover:cursor-pointer truncate ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ 
            backgroundColor: color ?? '#000',
            color: buttonTextColor 
          }}
        >
          {isLoading ? (
            'Connecting...'
          ) : isConnected ? (
            chainId === network.chainId ? `GM on ${name}` : `Switch to ${name}`
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </div>
  );
};

export default NetworkCard;
