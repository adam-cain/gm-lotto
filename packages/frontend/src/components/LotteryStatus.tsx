import useCountdown from '@/hooks/useCountdown';
import { useLotteryContract } from '@/hooks/useLotteryContract';
import { chainsById } from '@/lib/chains';
import { useChainId, useAccount } from 'wagmi';


export default function LotteryStatus() {
	const chainId = useChainId();
	const account = useAccount();
	const chain = chainsById[chainId];

	const { roundInfo, } = useLotteryContract(chainId);

	const time = useCountdown(Number(roundInfo?.endTime), 'endTime', 3);

	return (
		<div className="bg-white rounded-xl shadow-sm p-5">
			<h3 className="text-lg font-semibold mb-4">
				{chain?.name} {roundInfo?.roundNumber ? "Round #" + roundInfo.roundNumber : ""}
			</h3>
			{roundInfo ? (
				<div className="space-y-3">
					{/* Time remaining */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500">Time Remaining</span>
						<span className="text-sm font-medium">
							{time}
						</span>
					</div>

					{/* Participants */}
					{roundInfo && <>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-500">Total Tickets</span>
							<span className="text-sm font-medium">{roundInfo.ticketCount}</span>
						</div>
					</>}


					{account.isConnected && <>
						<hr className="my-3 border-gray-100" />
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-500">Your Tickets</span>
							<span className="text-sm font-medium">
								{roundInfo.userTicketCount}
							</span>
						</div>
					</>}

				</div>
			) : (
				<div className="text-sm text-center w-full text-gray-500">Loading...</div>
			)}
		</div>
	);
}