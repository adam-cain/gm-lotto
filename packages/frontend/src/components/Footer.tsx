import GMLotto from "./icons/GMLotto";
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-12 bg-white  border-t border-gray-200 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4 ">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-500/10    rounded-[16px] blur-md opacity-50" />
                <GMLotto className="w-full h-full object-contain relative z-10" />
              </div>
              <span className="text-base font-semibold text-gray-900  gradient-text  transition-colors duration-300">
                GM LOTTO
              </span>
            </div>
            <p className="text-gray-600 ">
              GM LOTTO is the premier platform for sending your daily GM greetings across multiple blockchains. Join thousands of users in this daily Web3 ritual.
            </p>
          </div>

          {/* Connect With Us */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 ">Connect With Us</h3>
            <div className="flex flex-col gap-4">
              <Link
                href="https://twitter.com/gm_lotto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600  hover:text-red-400  transition-colors group"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C18.6264 3.18302 16.7842 2.79451 15.1736 3.5015C13.563 4.20853 12.5725 5.9605 12.58 7.88005C12.58 8.31005 12.64 8.76005 12.72 9.17005C8.68 8.96005 5 7.05005 2.5 3.99005C2.01 4.82005 1.73 5.88005 1.73 7.00005C1.73155 8.02 1.97457 9.01534 2.43594 9.90033C2.8973 10.7853 3.5602 11.5335 4.38 12.0701C3.48 12.0201 2.58 11.7701 1.77 11.3601V11.4401C1.77 13.1901 2.83 14.6801 4.28 15.2001C3.8 15.3201 3.3 15.3601 2.8 15.3601C2.44 15.3601 2.09 15.3301 1.75 15.2601C2.45 16.7101 3.85 17.7301 5.45 17.7701C4.12 18.7801 2.5 19.3601 0.78 19.3601C0.5 19.3601 0.25 19.3401 0 19.3001C1.63 20.3701 3.52 21.0001 5.55 21.0001C12.57 21.0001 16.33 15.4601 16.33 10.6601V10.1001C17.3308 9.36702 18.2118 8.4731 18.92 7.44005C17.9798 7.84339 16.979 8.09191 15.96 8.17005C17.036 7.51761 17.8346 6.45844 18.22 5.22005C17.198 5.85016 16.0737 6.30037 14.9 6.55005C13.9626 5.56205 12.6287 5.0046 11.2324 5.00272C9.83604 5.00084 8.50042 5.55467 7.56 6.54005C6.62 7.52005 6 8.85005 6 10.2701C6.00366 10.7083 6.0584 11.1443 6.16 11.5701C3.10538 11.4207 0.254 9.72302 -1.99 7.00005C-2.56 8.27005 -2.3 9.74005 -1.5 10.7401C-2.2 10.7401 -2.9 10.5401 -3.5 10.2401C-3.55 11.9401 -2.29 13.5001 -0.5 14.0701C-1.14 14.2301 -1.8 14.2401 -2.44 14.1101C-1.9274 15.6077 -0.52576 16.6294 1.04 16.7401C-0.28 17.7401 -1.88 18.3501 -3.5 18.3301C-4 18.2601 -3.5 18.3701 -3 18.4701C-1.52304 19.4564 0.2438 19.9983 2.05 20.0001C9.06 20.0001 12.82 14.4601 12.82 9.66005V9.10005C13.8202 8.40735 14.6909 7.53857 15.38 6.53005C14.4397 6.90768 13.4447 7.13412 12.44 7.20005C13.4507 6.53135 14.2232 5.53463 14.59 4.36005C13.5813 4.95412 12.4766 5.368 11.33 5.59005C10.3523 4.59809 9.03161 4.02704 7.63854 4.00218C6.24547 3.97731 4.90429 4.50112 3.89 5.46005C2.87 6.42005 2.26 7.74005 2.25 9.13005C2.25126 9.57145 2.30067 10.0111 2.39677 10.4399C-0.478729 10.286 -3.11699 8.85051 -5 6.51005C-5.56 7.71005 -5.34 9.16005 -4.54 10.1001C-5.23 10.1001 -5.9 9.90005 -6.5 9.60005C-6.56 11.2201 -5.34 12.7301 -3.59 13.2601C-4.21 13.4101 -4.85 13.4301 -5.48 13.3201C-4.97 14.7701 -3.62 15.8001 -2.05 15.8501C-3.34 16.7901 -4.91 17.3601 -6.5 17.3101C-6.00464 17.82 -5.02938 18.3235 -4 18.4701C-1.89933 19.4664 0.608 20.0024 3.06 20.0001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Follow on Twitter</span>
              </Link>
              <Link
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600  hover:text-red-500  transition-colors group"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11.5C9 12.3284 8.32843 13 7.5 13C6.67157 13 6 12.3284 6 11.5C6 10.6716 6.67157 10 7.5 10C8.32843 10 9 10.6716 9 11.5Z" fill="currentColor"/>
                  <path d="M16.5 13C17.3284 13 18 12.3284 18 11.5C18 10.6716 17.3284 10 16.5 10C15.6716 10 15 10.6716 15 11.5C15 12.3284 15.6716 13 16.5 13Z" fill="currentColor"/>
                  <path d="M18.25 4.5C19.7688 4.5 21 5.73122 21 7.25V19L18.25 16.75H15.5L12.75 19V16.75H7.25C5.73122 16.75 4.5 15.5188 4.5 14V7.25C4.5 5.73122 5.73122 4.5 7.25 4.5H18.25ZM7.25 6C6.55964 6 6 6.55964 6 7.25V14C6 14.6904 6.55964 15.25 7.25 15.25H11.25V16.26L13.33 14.5H18.25C18.9404 14.5 19.5 13.9404 19.5 13.25V7.25C19.5 6.55964 18.9404 6 18.25 6H7.25Z" fill="currentColor"/>
                </svg>
                <span>Join our Discord</span>
              </Link>
            </div>
          </div>

          {/* Why GM LOTTO? */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 ">Why GM LOTTO?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                  <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-600 ">OnChain & Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                  <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-600 ">Multi-chain Support</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                  <path d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-600 ">Growing Community</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 ">Quick Links</h3>
            <nav className="space-y-2" aria-label="Footer navigation">
              <Link className="flex items-center gap-2 text-gray-600  hover:text-red-600  transition-colors" href="/documentation">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 14.25V11.25C19.5 9.51472 19.5 8.64708 19.0381 8.02246C18.9657 7.91302 18.887 7.80816 18.8034 7.7087C18.2891 7.11867 17.5183 7.05672 16 6.99318M17 15C17.4915 15 17.9027 15.4142 18 16C18.1501 17 19 17 19.5 17C20.8978 17 21.1014 17 21 15C20.6056 7.64245 19.9373 4.5 12 4.5C4.06274 4.5 3.39436 7.64245 3 15C2.89861 17 3.10218 17 4.5 17C5 17 5.84988 17 6 16C6.09726 15.4142 6.5085 15 7 15M16 6.99318C15.4875 6.97136 14.9155 6.95886 14.2663 6.95886H9.73371C9.08454 6.95886 8.51253 6.97136 8 6.99318M16 6.99318C16.2307 4.73792 15.0266 2.52145 12.3326 2.0771C11.9352 2 11.4953 2 10.6155 2H8.5C7.54665 2 7.0475 2.00825 6.63077 2.19239C6.08357 2.42477 5.64925 2.84155 5.4 3.36364C5.2 3.77015 5.19086 4.25138 5.172 5.20762L5.15894 5.98812C5.15389 6.28313 5.15137 6.43064 5.18341 6.54773C5.24257 6.75821 5.44145 6.9286 5.6602 6.98177C5.78492 7.01112 5.93705 6.99328 6.24132 6.95761C6.75743 6.89256 7.22198 6.73397 7.62671 6.50219C8.05314 6.25812 8.11551 6.14241 8.32972 5.91033C8.4987 5.72688 8.71825 5.59425 8.97743 5.59425H15.0226C15.2817 5.59425 15.5013 5.72688 15.6703 5.91033C15.8845 6.14241 15.9469 6.25812 16.3733 6.50219C16.778 6.73397 17.2426 6.89256 17.7587 6.95761C18.063 6.99328 18.2151 7.01112 18.3398 6.98177C18.5585 6.9286 18.7574 6.75821 18.8166 6.54773C18.8486 6.43064 18.8461 6.28313 18.8411 5.98812L18.828 5.20762C18.8091 4.25138 18.8 3.77015 18.6 3.36364C18.3508 2.84155 17.9164 2.42477 17.3692 2.19239C16.9525 2.00825 16.4533 2 15.5 2H13.3845C12.5047 2 12.0648 2 11.6674 2.0771C11.4651 2.10065 11.2675 2.13718 11.0764 2.18561" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 8.50001H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 12C10.8954 12 10 12.8954 10 14V16C10 17.1046 10.8954 18 12 18C13.1046 18 14 17.1046 14 16V14C14 12.8954 13.1046 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 17V21.4C19 21.7314 18.7314 22 18.4 22H5.6C5.26863 22 5 21.7314 5 21.4V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Documentation</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-600  hover:text-red-600  transition-colors" href="/why-gm-lotto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Why GM LOTTO</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-600  hover:text-red-600  transition-colors" href="/deploy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Deploy Contract</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-600  hover:text-red-600  transition-colors" href="/embed">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Embed GM Button</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-600  hover:text-red-600  transition-colors" href="/referral-system">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Referral System</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-600  hover:text-red-600  transition-colors" href="/community-guidelines">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Community Guidelines</span>
              </Link>
              <Link className="flex items-center gap-2 text-gray-600  hover:text-red-600  transition-colors" href="/support">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.87999 7.71001L14.16 11.99L9.87999 16.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Support</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 ">
          <p className="text-center text-gray-600 ">
            © 2025 GM LOTTO. Built with ❤️ for the GM Web3 community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
