"use client"
import ChainGrid from "@/components/ChainGrid";
import WalletStatus from "@/components/WalletStatus";
import LotteryStatus from "@/components/LotteryStatus";
import Winners from "@/components/Winners";
// import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-screen">
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold gradient-text mb-4 text-balance leading-tight">
            Say GM to the Blockchain.<br /> Win Big Just for Waking Up.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Every good morning you send earns a chance at on-chain rewards.
          </p>
        </div>
        {/* <LotteryInterface /> */}
        <ChainGrid />
      </div>

      <div className="md:sticky md:top-32 md:h-fit md:w-64 lg:w-80 space-y-6">
        <WalletStatus />
        <LotteryStatus />
        <Winners />
      </div>
    </div>
  );
}
