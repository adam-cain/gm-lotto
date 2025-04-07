import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider as RKProvider, darkTheme, midnightTheme, lightTheme, cssObjectFromTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { ReactNode } from 'react';
import { config } from '@/lib/wagmi';
const queryClient = new QueryClient();

export function RainbowKitProvider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RKProvider initialChain={10}>
                    {children}
                </RKProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}