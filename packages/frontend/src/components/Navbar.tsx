import type React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import GMLotto from './icons/GMLotto';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    //  shadow-lg/5 border-b border-gray-100
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg/5 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center gap-3" href="/">
            <div className="relative w-12 h-12 flex-shrink-0">
              <GMLotto width={300} height={300} className="w-full h-full object-contain relative z-10 text-black"/>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold font-heading gradient-text">
                GM Lotto
              </h1>
              <span className="text-xs font-medium tracking-wider text-black">
                Say GM to the Superchain
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className="p-2.5 gradient-bg rounded-xl hover:from-purple-500/20 hover:to-indigo-500/20   transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:translate-y-0 shadow-sm flex items-center justify-center w-[42px] h-[42px]"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3V4M12 20V21M3 12H4M20 12H21M18.364 18.364L17.657 17.657M5.636 5.636L6.343 6.343M18.364 5.636L17.657 6.343M5.636 18.364L6.343 17.657M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#7C3AED" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>

              )}
            </button> */}

            {/* Deploy Button */}
            {/* <a
              className="flex items-center gap-2 px-4 py-2.5 gradient-bg rounded-xl hover:from-purple-500/20 hover:to-indigo-500/20   transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              href="/deploy"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold gradient-text">Deploy</span>
            </a> */}

            {/* Connect Wallet Button */}
            {/* <button
                onClick={connectWallet}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
              >
                Connect Wallet
              </button> */}
            <ConnectButton accountStatus="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
