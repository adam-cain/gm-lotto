"use client"

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NetworkProvider } from '@/context/NetworkContext';
import { RainbowKitProvider } from '@/context/RainbowKitProvider';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-40">
                <RainbowKitProvider>
                    <NetworkProvider>
                        <Navbar
                            theme={theme}
                            toggleTheme={toggleTheme}
                        />
                        <main className="container mx-auto px-4 pb-16">
                            {children}
                        </main>
                    </NetworkProvider>
                    <Footer />
                </RainbowKitProvider>
            </div>
        </div>
    );
} 