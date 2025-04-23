import "./globals.css";
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Inter, Montserrat, Roboto } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-roboto',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "GM Lotto",
  description: "GM Lotto is the premier platform for saying GM to the Superchain. Every good morning you send earns a chance at on-chain rewards. Join thousands of users in this daily Web3 ritual.",
  icons: {
    icon: '/logo-bg.svg',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.
        variable} ${montserrat.variable} font-sans 
        antialiased`}>
        <ClientLayout>
            {children}
        </ClientLayout>
      </body>
    </html>
  );
}
