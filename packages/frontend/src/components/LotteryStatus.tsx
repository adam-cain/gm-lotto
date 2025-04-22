"use client";

import { useState } from 'react';
import { useLotteryContext } from '@/providers/LotteryProvider';
import { useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';

export default function LotteryStatus() {
	const { address } = useAccount();
	const {
		currentChainId,
		roundInfo,
		lastParticipation,
		isPending,
		enterLottery
	} = useLotteryContext();
	
	const [isLoading, setIsLoading] = useState(false);
	
	// Early return if not connected or no round info
	if (!address || !currentChainId || !roundInfo) {
		return (
			<div className="p-6 bg-gray-50 rounded-lg shadow-sm">
				<h2 className="text-xl font-semibold mb-2">Lottery Status</h2>
				<p className="text-gray-500">
					{!address 
						? "Connect your wallet to see lottery status" 
						: "Loading lottery information..."}
				</p>
			</div>
		);
	}
	
	// Calculate time since last participation
	let lastEntryTime = "Never participated";
	let canParticipate = true;
	
	if (lastParticipation > 0) {
		const lastEntry = new Date(lastParticipation * 1000);
		lastEntryTime = formatDistanceToNow(lastEntry, { addSuffix: true });
		
		// Check if 24 hours have passed
		const waitTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
		canParticipate = Date.now() - lastEntry.getTime() >= waitTime;
	}
	
	// Handle lottery entry
	const handleEnterLottery = async () => {
		if (!canParticipate) return;
		
		setIsLoading(true);
		try {
			await enterLottery();
			// No need to update state manually as the store will be updated via events
		} catch (error) {
			console.error("Failed to enter lottery:", error);
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<div className="p-6 bg-gray-50 rounded-lg shadow-sm">
			<h2 className="text-xl font-semibold mb-4">Current Lottery Status</h2>
			
			<div className="space-y-3 mb-6">
				<div className="flex justify-between">
					<span className="text-gray-600">Round:</span>
					<span className="font-medium">{roundInfo.roundNumber}</span>
				</div>
				
				{/* <div className="flex justify-between">
					<span className="text-gray-600">Total Tickets:</span>
					<span className="font-medium">{roundInfo.ticketCount}</span>
				</div> */}
				
				<div className="flex justify-between">
					<span className="text-gray-600">Your Tickets:</span>
					<span className="font-medium">{roundInfo.userTicketCount}</span>
				</div>
				
				<div className="flex justify-between">
					<span className="text-gray-600">Last Entry:</span>
					<span className="font-medium">{lastEntryTime}</span>
				</div>
			</div>
			
			<button
				onClick={handleEnterLottery}
				disabled={!canParticipate || isLoading || isPending}
				className={`w-full py-2 px-4 rounded-md font-medium transition ${
					canParticipate && !isLoading && !isPending
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
			</p>
		</div>
	);
}