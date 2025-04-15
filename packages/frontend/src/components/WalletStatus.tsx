import { useAccount, useBalance, useDisconnect, useChainId, useEnsName } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatAddress } from '@/utils/address';
import { chains } from '@/lib/chains';
import Image from 'next/image';
import Card from './Card';
const WalletStatus = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address });

  // Get network name based on chainId from chains list
  const getNetworkName = () => {
    const chain = chains.find(c => c.id === chainId);
    return chain?.name || 'Unknown Network';
  };

  const getNetworkImage = () => {
    const chain = chains.find(c => c.id === chainId);
    return typeof chain?.iconUrl === 'string' ? chain.iconUrl : '/images/chains/optimism.svg';
  };

  return (
    <Card>
      <div className="flex items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold">Your Wallet</h3>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      {isConnected && address ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Address</span>
            <span className="text-sm font-medium">
              {ensName || formatAddress(address)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Network</span>
            <div className="flex items-center gap-1">
              <span className="text-sm inline-flex items-center gap-1 font-medium">
                <Image src={getNetworkImage()} alt={getNetworkName()} width={20} height={20} className='rounded-full' />
                {getNetworkName()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Balance</span>
            <span className="text-sm font-medium">
              {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Connect Wallet
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      )}
    </Card>
  );
};

export default WalletStatus;
