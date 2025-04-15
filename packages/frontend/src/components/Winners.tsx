import { useLotteryContract } from "@/hooks/useLotteryContract";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import Card from "./Card";

// Mock data for testing
const mockPastRounds = [
  {
    startTime: BigInt(1710000000),
    endTime: BigInt(1710086400),
    isActive: false,
    winner: "0x49eCBEbf2a948BCC39c402688592182206d88da9" as `0x${string}`,
    prizeAmount: BigInt(1500000000000000000), // 1.5 ETH
    prizeSet: true,
    prizeClaimed: true,
    roundNumber: 1
  },
  {
    startTime: BigInt(1709913600),
    endTime: BigInt(1710000000),
    isActive: false,
    winner: "0x2048E880Cb351E19BB11836b8B71cC60bd043E7B" as `0x${string}`,
    prizeAmount: BigInt(800000000000000000), // 0.8 ETH
    prizeSet: true,
    prizeClaimed: false,
    roundNumber: 2
  },
  {
    startTime: BigInt(1709913600),
    endTime: BigInt(1710000000),
    isActive: false,
    winner: "0x2048E880Cb351E19BB11836b8B71cC60bd043E7B" as `0x${string}`,
    prizeAmount: BigInt(800000000000000000), // 0.8 ETH
    prizeSet: true,
    prizeClaimed: false,
    roundNumber: 2
  },
  {
    startTime: BigInt(1709913600),
    endTime: BigInt(1710000000),
    isActive: false,
    winner: "0x2048E880Cb351E19BB11836b8B71cC60bd043E7B" as `0x${string}`,
    prizeAmount: BigInt(800000000000000000), // 0.8 ETH
    prizeSet: true,
    prizeClaimed: false,
    roundNumber: 2
  },
  {
    startTime: BigInt(1709827200),
    endTime: BigInt(1709913600),
    isActive: false,
    winner: "0x3456789012abcdef3456789012abcdef34567890" as `0x${string}`,
    prizeAmount: BigInt(2200000000000000000), // 2.2 ETH
    prizeSet: true,
    prizeClaimed: true,
    roundNumber: 3
  }
];

const Winners: React.FC = () => {
  const { chainId } = useAccount();
  const { roundInfo, claimPrize } = useLotteryContract(chainId || 0);
  const account = useAccount();

  // Use mock data in development
  const pastRounds = process.env.NODE_ENV === 'development'
    ? mockPastRounds
    : roundInfo?.pastRounds || [];

  if (!chainId || !roundInfo) return null;
  console.log(pastRounds);
  console.log(account.address);
  const isWinner = pastRounds.filter((round) => round.winner === account.address);

  return (
    <Card>
      <div className="flex items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Recent Winners</h3>
      </div>

      <div className="space-y-4">
        {isWinner.length > 0 && (
          <div className="text-sm bg-green-50 p-3 rounded-lg border border-green-100">
            <h3 className="text-base font-bold text-green-600 mb-2">You&apos;ve won!</h3>
            {isWinner.map((winner, index) => (
              <div key={index}>
                {index > 0 && <hr className="border-red-100 my-2" />}
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
              <p className="text-xs text-gray-500">
                {round?.endTime ? new Date(Number(round.endTime) * 1000).toLocaleDateString() : 'No end time'}
              </p>
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
