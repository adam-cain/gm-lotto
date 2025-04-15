import GMLotto from "./icons/GMLotto";
import Link from 'next/link';
import XIcon from "./icons/X";
import InverseRoundedCorner from "./InverseRoundedCorner";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="mt-auto pb-12 border-t border-gray-800 bg-stone-900">
        <div className="relative w-full mb-12">
          <InverseRoundedCorner
          className="absolute bottom-0 left-0 rotate-180"
          size={60}
          position="bottom-right"
          color="bg-stone-900" />
          <InverseRoundedCorner
          className="absolute bottom-0 right-0 rotate-90 fill-stone-900"
          size={60}
          position="bottom-right"
          color="bg-stone-900" />
        </div>
        <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <GMLotto className="w-full h-full object-contain relative z-10 invert" />
              </div>
              <h1 className="text-3xl font-bold gradient-text transition-colors duration-300">
                GM LOTTO
              </h1>
            </div>
            <p className="text-gray-100">
              GM LOTTO is the premier platform for saying GM to the blockchain. Every good morning you send earns a chance at on-chain rewards. Join thousands of users in this daily Web3 ritual.
            </p>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Connect With Us</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="https://x.com/gm_lotto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-100 hover:text-gray-300 transition-colors group"
                >
                <span>Follow us on</span>
                <XIcon width={12} height={12} />
              </Link>
            </div>
          </div>

          {/* Why GM LOTTO? */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Why GM LOTTO?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
                  <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-100">OnChain & Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
                  <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-100">Multi-chain Support</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
                  <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-100">Growing Community</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
                  <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-100">Monthly Rewards</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <nav className="space-y-2" aria-label="Footer navigation">
              <Link className="flex items-center gap-2 text-gray-100 hover:text-gray-300 transition-colors" href="/documentation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-100">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Documentation</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-100 hover:text-gray-300 transition-colors" href="/why-gm-lotto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-100">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Why GM LOTTO</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-100 hover:text-gray-300 transition-colors" href="/community-guidelines">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-100">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Community Guidelines</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-100 hover:text-gray-300 transition-colors" href="/support">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-100">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Support</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
