"use client"
import Announcements from "@/components/Announcements";
import { LotteryInterface } from "@/components/LotteryInterface";
import ChainGrid from "@/components/ChainGrid";
import WalletStatus from "@/components/WalletStatus";
// import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-screen">
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4 text-balance">
            Say GM to the Blockchain. Win Big Just for Waking Up.
          </h1>
          <p className="text-md text-gray-600 ">
            Every good morning you send earns a chance at on-chain rewards.
          </p>
        </div>
        <LotteryInterface />
        <ChainGrid />
      </div>

      <div className="md:sticky md:top-32 md:h-fit md:w-64 lg:w-80 space-y-6">
        <WalletStatus />
        <Announcements />
      </div>
    </div>
  );
}
