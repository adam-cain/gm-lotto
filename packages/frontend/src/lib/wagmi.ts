import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { chains } from "./chains";
import { http } from "wagmi";

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set");
}

const transports: Record<number, ReturnType<typeof http>> = {};
chains.forEach((chain) => {
  transports[chain.id] = http(chain.rpcUrls.default.http[0]);
});

// Create the RainbowKit/Wagmi configuration
export const config = getDefaultConfig({
  appName: "LottoGM",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: chains,
  transports: transports,
  ssr: true,
});
