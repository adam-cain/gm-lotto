import {
  useReadContract,
  useWriteContract,
  useSwitchChain,
  useContractWrite,
  useTransaction,
} from "wagmi";
import {
  LOTTERY_CONTRACT_ABI,
} from "../config/contracts";
import { formatEther } from "viem";
import { useState } from "react";

export interface RoundInfo {
  roundNumber: bigint;
  startTime: bigint;
  endTime: bigint;
  prizePool: bigint;
  participantCount: bigint;
  isActive: boolean;
  // Converted values
  formattedPrizePool: string;
  formattedParticipantCount: number;
  formattedStartTime: Date;
  formattedEndTime: Date;
}

export function useLotteryContract(
  chainId: number,
  contractAddress: `0x${string}`
) {
  const { switchChain } = useSwitchChain();
  const { writeContract } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  // Get current round info
  const { data: rawRoundInfo, refetch: refetchRoundInfo } = useReadContract({
    address: contractAddress,
    abi: LOTTERY_CONTRACT_ABI,
    functionName: "getCurrentRoundInfo",
  }) as { data: [bigint, bigint, bigint, bigint, bigint, boolean] | undefined; refetch: () => void };

  const roundInfo: RoundInfo | undefined = rawRoundInfo ? {
    roundNumber: rawRoundInfo[0],
    startTime: rawRoundInfo[1],
    endTime: rawRoundInfo[2],
    prizePool: rawRoundInfo[3],
    participantCount: rawRoundInfo[4],
    isActive: rawRoundInfo[5],
    // Converted values
    formattedPrizePool: formatEther(rawRoundInfo[3]),
    formattedParticipantCount: Number(rawRoundInfo[4]),
    formattedStartTime: new Date(Number(rawRoundInfo[1]) * 1000),
    formattedEndTime: new Date(Number(rawRoundInfo[2]) * 1000)
  } : undefined;


  const { data: currentRound } = useReadContract({
    address: contractAddress,
    abi: LOTTERY_CONTRACT_ABI,
    functionName: "currentRound",
  });


  // Get time until round end
  const { data: timeUntilEnd } = useReadContract({
    address: contractAddress,
    abi: LOTTERY_CONTRACT_ABI,
    functionName: "timeUntilRoundEnd",
  });

  
  const enterLottery = async () => {
    try {
      // Switch to the correct chain first
      await switchChain({
        chainId: chainId,
      });

      await writeContract({
        abi: LOTTERY_CONTRACT_ABI,
        address: contractAddress,
        functionName: "enterLottery",
        value: BigInt(0), // Send 0 ETH since the contract is deployed with 0 entry fee
      });

      return true;
    } catch (error) {
      console.error("Error entering lottery:", error);
      throw error;
    }
  };

  // Wait for transaction confirmation
  const { isLoading: isEntering, isSuccess: hasEntered } = useTransaction({
    hash: txHash,
  });

  // Get participants for current round
  const { data: participants } = useReadContract({
    address: contractAddress,
    abi: LOTTERY_CONTRACT_ABI,
    functionName: "getRoundParticipants",
    args: [currentRound],
  });

  return {
    roundInfo,
    currentRound,
    timeUntilEnd,
    // entryFee,
    participants,
    enterLottery,
    isEntering,
    hasEntered,
    refetchRoundInfo,
  };
}
