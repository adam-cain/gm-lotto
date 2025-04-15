"use client"
import ChainGrid from "@/components/ChainGrid";
import WalletStatus from "@/components/WalletStatus";
import LotteryStatus from "@/components/LotteryStatus";
import Winners from "@/components/Winners";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-16 min-h-screen">
      <div className="flex-1">
        <div className="mb-8 lg:mb-16 relative overflow-hidden rounded-4xl aspect-video">
          <Image 
            src="/hero.png" 
            alt="Say GM to the Superchain" 
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-8 bg-gradient-to-t from-black/60 to-transparent">
            <h1 className="text-2xl sm:text-5xl md:text-3xl lg:text-5xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 md:mb-4 text-balance leading-tight">
              Say GM to the Blockchain. Win Big Just for Waking Up.
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 max-w-2xl">
              Every good morning you send earns a chance at on-chain rewards.
            </p>
          </div>
        </div>
        <ChainGrid />
      </div>

      <div className="md:sticky md:top-28 md:h-fit md:w-64 lg:w-80 space-y-6">
        <WalletStatus />
        <LotteryStatus />
        <Winners />
      </div>
    </div>
  );
}
