import { useAccount, useConnect } from 'wagmi';
import { useLotteryContract } from '../hooks/useLotteryContract';
import { formatEther } from 'viem';
import { useState } from 'react';

export function LotteryInterface() {
  const { address, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const [isEntering, setIsEntering] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  const {
    roundInfo,
    timeUntilEnd,
    participants,
    enterLottery,
  } = useLotteryContract(11155420, "0x3D90A64c52Bcbdb9B8b9bD305c6d92be9302CBEc");

  const handleEnterLottery = async () => {
    try {
      console.log('Starting lottery entry...');
      setIsEntering(true);
      await enterLottery();
      console.log('Transaction submitted successfully');
      setHasEntered(true);
    } catch (error) {
      console.error('Error entering lottery:', error);
      // Reset states on error
      setIsEntering(false);
      setHasEntered(false);
    } finally {
      setIsEntering(false);
    }
  };

  if (isConnecting) {
    return (
      <div className="p-4 text-center">
        <p>Connecting wallet...</p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="p-4 text-center">
        <p>Please connect your wallet to participate in the lottery</p>
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold
                     hover:bg-blue-700 transition-colors duration-200"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!roundInfo) {
    return (
      <div className="p-4 text-center">
        <p>Loading lottery information...</p>
      </div>
    );
  }

  const timeLeft = timeUntilEnd ? Number(timeUntilEnd) : 0;
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">GM Lottery</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Round</p>
            <p className="text-xl font-semibold">{roundInfo.roundNumber.toString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Prize Pool</p>
            <p className="text-xl font-semibold">{roundInfo.formattedPrizePool} ETH</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Time Remaining</p>
          <p className="text-xl font-semibold">
            {hours}h {minutes}m
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Participants</p>
          <p className="text-xl font-semibold">{roundInfo.formattedParticipantCount}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Round Ends</p>
          <p className="text-xl font-semibold">
            {roundInfo.formattedEndTime.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleEnterLottery}
          disabled={!roundInfo.isActive || isEntering || hasEntered}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          {isEntering ? 'Entering...' : 
           hasEntered ? 'Entered' : 
           !roundInfo.isActive ? 'Round Ended' :
           `Enter Lottery`}
        </button>
      </div>

      {Array.isArray(participants) && participants.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Current Participants</h3>
          <div className="space-y-2">
            {participants.map((participant: string, index: number) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-sm font-mono">
                {participant}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 