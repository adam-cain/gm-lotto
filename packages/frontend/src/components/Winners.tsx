import { useLotteryContext } from "@/providers/LotteryProvider";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import Card from "./Card";

const Winners: React.FC = () => {
  const { address } = useAccount();
  const { roundInfo, claimPrize, currentChainId } = useLotteryContext();
  
  // Use mock data in development
  const pastRounds = roundInfo?.pastRounds || [];
  
  if (!currentChainId || !roundInfo) return null;
  
  const isWinner = pastRounds.filter((round) => round.winner === address && round.prizeClaimed === false);

  return (
    <Card>
      <div className="flex items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold">Recent Winners</h3>
      </div>

      <div className="space-y-4">
        {isWinner.length > 0 && (
          <div className="text-sm bg-green-50 p-3 rounded-lg border border-green-100">
            <h3 className="text-base font-bold text-green-600 mb-2">You&apos;ve won!</h3>
            {isWinner.map((winner, index) => (
              <div key={index}>
                {index > 0 && <hr className="border-green-100 my-2" />}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {formatEther(BigInt(winner.prizeAmount))} ETH
                  </p>
                  <button
                    onClick={() => claimPrize(BigInt(winner.roundNumber))}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">
                    Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pastRounds.length > 0 ? (
          pastRounds.map((round, index) => (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium">
                  {round?.winner ? `${round.winner.substring(0, 6)}...${round.winner.substring(38)}` : 'No winner'}
                </h4>
                <span className="text-sm text-green-500 font-medium">
                  {round?.prizeAmount ? `+${Number(round.prizeAmount) / 1e18} ETH` : 'No prize'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-center w-full py-4">
            <h4 className="text-lg font-medium text-gray-700">No winners yet</h4>
            <p className="text-xs text-gray-500 mt-1">Check back soon!</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Winners;
