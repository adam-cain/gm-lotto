import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "GM LOTTO",
  description: "GM LOTTO is the premier platform for saying GM to the blockchain. Every good morning you send earns a chance at on-chain rewards. Join thousands of users in this daily Web3 ritual.",
  icons: {
    icon: '/logo-bg.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${spaceGrotesk.className} ${jetBrainsMono.className} antialiased`}
      >
          <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
