import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';
import { chains } from './chains';

  // Create transports for each chain
//   const transports: Record<number, ReturnType<typeof http>> = {};
//   chains.forEach((chain) => {
//     transports[chain.id] = http(chain.rpcUrls.default.http[0]);
//   });
  
  // Create the RainbowKit/Wagmi configuration
  export const config = getDefaultConfig({
      appName: 'LottoGM',
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '765027f192f977fed3f891f120827ecc', // Replace with your actual project ID
      // @ts-ignore fullfill the type
      chains: chains,
      ssr: true,
  });