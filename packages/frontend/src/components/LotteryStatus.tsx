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
	const contractAddress = chains[0].contractAddress as `0x${string}`;
	const [countdown, setCountdown] = useState<number | undefined>(undefined);

	const {
		roundInfo,
		currentRound,
		timeUntilEnd,
		lastParticipationTimestamp,
		enterLottery,
		setPrizeAmount,
		claimPrize,
		getRoundInfo,
		isEntering,
		hasEntered,
		refetchRoundInfo,
	} = useLotteryContract(chainId, contractAddress);

	useEffect(() => {
		if (!timeUntilEnd) return;

		// Set initial countdown
		setCountdown(Number(timeUntilEnd));

		// Update countdown every second
		const interval = setInterval(() => {
			setCountdown(prev => {
				if (prev === undefined || prev <= 0) return 0;
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [timeUntilEnd]);

	return (
		<div className="bg-white rounded-xl shadow-sm p-4">
			<div className="flex items-center align-middle mb-2 gap-2">
				<h3 className="text-lg font-semibold">Lottery Status</h3>
			</div>

			{roundInfo ? (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500">Round</span>
						<span className="text-sm font-mono">#{Number(roundInfo.roundNumber)}</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500">Participants</span>
						<span className="text-sm">{roundInfo.ticketCount}</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500">Time Remaining</span>
						<span className="text-sm font-mono">
							{formatTimeRemaining(countdown)}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500">Status</span>
						<span className="text-sm">
							{roundInfo.isActive ? 'Active' : 'Closed'}
						</span>
					</div>
				</div>
			) : (
				<div className="text-sm text-gray-500">Loading lottery information...</div>
			)}
		</div>
	);
}