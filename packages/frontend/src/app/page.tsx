"use client"
import ChainGrid from "@/components/ChainGrid";
import WalletStatus from "@/components/WalletStatus";
import LotteryStatus from "@/components/LotteryStatus";
import Winners from "@/components/Winners";
import Image from "next/image";
// import Admin from "@/components/Admin";

export default function Home() {
  return (
    <>
    {/* <Admin /> */}
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
            <h1 className="text-2xl sm:text-5xl md:text-3xl lg:text-5xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-2 sm:mb-3 md:mb-4 2xl:mb-5 text-balance leading-tight">
              <span className="relative inline-block">
                <span className="relative z-10">Say GM</span>
                <span className="absolute bottom-1 left-[-4px] right-[-4px] h-2 md:h-3 lg:h-3 xl:h-4 2xl:h-5 bg-red-600 z-0"></span>
              </span> to the Superchain. <span className="relative inline-block">
                <span className="relative z-10">Win Big</span>
                <span className="absolute bottom-1 left-[-4px] right-[-4px] h-2 md:h-3 lg:h-3 xl:h-4 2xl:h-5 bg-red-600 z-0"></span>
              </span> Just for Waking Up.
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-200">
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
    </>
  );
}
