"use client"

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChainProvider } from '@/context/ChainContext';
import { RainbowKitProvider } from '@/context/RainbowKitProvider';
import { LotteryProvider } from '@/providers/LotteryProvider';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white text-gray-900 pt-28 lg:pt-32">
            <RainbowKitProvider>
                <ChainProvider>
                    <LotteryProvider>
                        <Navbar />
                        <main className="container mx-auto px-4 pb-16">
                            {children}
                        </main>
                    </LotteryProvider>
                </ChainProvider>
            </RainbowKitProvider>
            <Footer />
        </div>
    );
} 