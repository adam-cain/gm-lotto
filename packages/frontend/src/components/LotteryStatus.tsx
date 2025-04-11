import useCountdown from '@/hooks/useCountdown';
import { useLotteryContract } from '@/hooks/useLotteryContract';
import { chains } from '@/lib/chains';
import { useEffect, useState } from 'react';

const formatTimeRemaining = (seconds: number | undefined): string => {
	if (seconds === undefined) return 'Loading...';

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const parts = [];
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
	parts.push(`${remainingSeconds}s`);

	return parts.join(' ');
};

export default function LotteryStatus() {
	const chainId = chains[0].id;
	const contractAddress = chains[0].managerAddress as `0x${string}`;
	const tokenAddress = chains[0].tokenAddress as `0x${string}`;

	const {
		roundInfo,
		currentRound,
		timeUntilEnd,
	} = useLotteryContract(chainId, contractAddress, tokenAddress);

	const time = useCountdown(Number(timeUntilEnd), 'timeLeft', 3);

	return (
		<div className="bg-white rounded-xl shadow-sm p-4">
			<div className="flex items-center align-middle mb-2 gap-2">
				<h3 className="text-lg font-semibold">Round #{currentRound}</h3>
			</div>

			{roundInfo ? (
				<div className="space-y-2">
					{/* Time remaining */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500">Time Remaining</span>
						<span className="text-sm font-mono">
							{time}
						</span>
					</div>

					{/* Participants */}
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500">Total Tickets</span>
						<span className="text-sm">{roundInfo.ticketCount}</span>
					</div>



					{/* <hr className="my-2 border-gray-200" />
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500">Your Stats</span>
						<span className="text-sm">
							{roundInfo.isActive ? 'Active' : 'Closed'}
						</span>
					</div> */}
					
				</div>
			) : (
				<div className="text-sm text-gray-500">Loading lottery information...</div>
			)}
		</div>
	);
}