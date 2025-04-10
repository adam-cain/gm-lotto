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
  ticketCount: bigint;
  isActive: boolean;
  // Converted values
  formattedStartTime: Date;
  formattedEndTime: Date;
}

export interface FullRoundInfo {
  startTime: bigint;
  endTime: bigint;
  ticketIds: bigint[];
  isActive: boolean;
  winner: `0x${string}`;
  prizeAmount: bigint;
  prizeSet: boolean;
  prizeClaimed: boolean;
  // Converted values
  formattedStartTime: Date;
  formattedEndTime: Date;
  formattedPrizeAmount: string;
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
  }) as { data: [bigint, bigint, bigint, bigint, boolean] | undefined; refetch: () => void };

  const roundInfo: RoundInfo | undefined = rawRoundInfo ? {
    roundNumber: rawRoundInfo[0],
    startTime: rawRoundInfo[1],
    endTime: rawRoundInfo[2],
    ticketCount: rawRoundInfo[3],
    isActive: rawRoundInfo[4],
    // Converted values
    formattedStartTime: new Date(Number(rawRoundInfo[1]) * 1000),
    formattedEndTime: new Date(Number(rawRoundInfo[2]) * 1000)
  } : undefined;

  // Get current round number
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

  // Get last participation timestamp for current user
  const { data: lastParticipationTimestamp } = useReadContract({
    address: contractAddress,
    abi: LOTTERY_CONTRACT_ABI,
    functionName: "lastParticipationTimestamp",
    args: [contractAddress],
  });

  const enterLottery = async () => {
    try {
      // Switch to the correct chain first
      await switchChain({
        chainId: chainId,
      });

      const result = await writeContract({
        abi: LOTTERY_CONTRACT_ABI,
        address: contractAddress,
        functionName: "enterLottery",
      });

      setTxHash(result as unknown as `0x${string}`);
      return true;
    } catch (error) {
      console.error("Error entering lottery:", error);
      throw error;
    }
  };

  const setPrizeAmount = async (roundNumber: bigint, amount: bigint) => {
    try {
      await switchChain({
        chainId: chainId,
      });

      const result = await writeContract({
        abi: LOTTERY_CONTRACT_ABI,
        address: contractAddress,
        functionName: "setPrizeAmount",
        args: [roundNumber, amount],
        value: amount,
      });

      setTxHash(result as unknown as `0x${string}`);
      return true;
    } catch (error) {
      console.error("Error setting prize amount:", error);
      throw error;
    }
  };

  const claimPrize = async (roundNumber: bigint) => {
    try {
      await switchChain({
        chainId: chainId,
      });

      const result = await writeContract({
        abi: LOTTERY_CONTRACT_ABI,
        address: contractAddress,
        functionName: "claimPrize",
        args: [roundNumber],
      });

      setTxHash(result as unknown as `0x${string}`);
      return true;
    } catch (error) {
      console.error("Error claiming prize:", error);
      throw error;
    }
  };

  // Get full round info
  const getRoundInfo = async (roundNumber: bigint): Promise<FullRoundInfo | undefined> => {
    try {
      const { data } = await useReadContract({
        address: contractAddress,
        abi: LOTTERY_CONTRACT_ABI,
        functionName: "getRoundInfo",
        args: [roundNumber],
      });

      if (!data) return undefined;

      const [
        startTime,
        endTime,
        ticketIds,
        isActive,
        winner,
        prizeAmount,
        prizeSet,
        prizeClaimed
      ] = data as [bigint, bigint, bigint[], boolean, `0x${string}`, bigint, boolean, boolean];

      return {
        startTime,
        endTime,
        ticketIds,
        isActive,
        winner,
        prizeAmount,
        prizeSet,
        prizeClaimed,
        // Converted values
        formattedStartTime: new Date(Number(startTime) * 1000),
        formattedEndTime: new Date(Number(endTime) * 1000),
        formattedPrizeAmount: formatEther(prizeAmount),
      };
    } catch (error) {
      console.error("Error getting round info:", error);
      return undefined;
    }
  };

  // Wait for transaction confirmation
  const { isLoading: isEntering, isSuccess: hasEntered } = useTransaction({
    hash: txHash,
  });

  return {
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
  };
}
