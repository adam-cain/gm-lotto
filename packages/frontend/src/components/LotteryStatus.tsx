"use client";

import { useLotteryContext } from '@/providers/LotteryProvider';
import { useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';
import Card from './Card';
import { chainsById } from '@/lib/chains';

export default function LotteryStatus() {
	const { address } = useAccount();
	const {
		currentChainId,
		roundInfo,
		lastParticipation,
	} = useLotteryContext();

	const chainName = currentChainId && chainsById[currentChainId] ? chainsById[currentChainId].name : "";
	const title = chainName + (roundInfo?.roundNumber ? " Round #" + roundInfo?.roundNumber : "");

	// Early return if not connected or no round info
	if (!address || !currentChainId || !roundInfo) {
		return (
			<Card>
				<div className="flex items-center mb-4 gap-2">
					<h3 className="text-lg font-semibold">{title}</h3>
				</div>
				<p className="text-gray-500 w-full text-center text-sm">
					{!address
						? "Connect your wallet to see lottery information"
						: "Loading lottery information..."}
				</p>
			</Card>
		);
	}

	// Calculate time since last participation
	let lastEntryTime = "Never";
	// let canParticipate = true;

	if (lastParticipation > 0) {
		const lastEntry = new Date(lastParticipation * 1000);
		lastEntryTime = formatDistanceToNow(lastEntry, { addSuffix: true });

		// Check if 24 hours have passed
		// const waitTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
		// canParticipate = Date.now() - lastEntry.getTime() >= waitTime;
	}

	return (
		<Card>
			<div className="flex items-center mb-4 gap-2">
				<h3 className="text-lg font-semibold">{title}</h3>
			</div>

			<div className="space-y-3">
				<div className="flex justify-between">
					<span className="text-sm text-gray-500">Total Tickets</span>
					<span className="text-sm font-medium">{roundInfo.ticketCount}</span>
				</div>

				<div className="flex justify-between">
					<span className="text-sm text-gray-500">Your Tickets</span>
					<span className="text-sm font-medium">{roundInfo.userTicketCount}</span>
				</div>

				<div className="flex justify-between">
					<span className="text-sm text-gray-500">Last Entry</span>
					<span className="text-sm font-medium">{lastEntryTime}</span>
				</div>
			</div>
			{/* <button
				onClick={handleEnterLottery}
				disabled={!canParticipate || isLoading || isPending}
				className={`w-full py-2 px-4 rounded-md font-medium transition ${canParticipate && !isLoading && !isPending
					? "bg-blue-600 hover:bg-blue-700 text-white"
					: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}
			>
				{isLoading || isPending
					? "Processing..."
					: canParticipate
						? "Enter Lottery"
						: "Wait 24h Between Entries"}
			</button>

			<p className="mt-3 text-sm text-gray-500 text-center">
				{canParticipate
					? "You can enter once every 24 hours"
					: "You've already entered in the last 24 hours"}
			</p> */}
		</Card>
	);
}