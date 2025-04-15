import ChainCard from './ChainCard';
import { useChainContext } from '../context/ChainContext';
import { Chain } from '@/lib/chains';
import { useAccount } from 'wagmi';

const ChainGrid: React.FC = () => {
  const { searchTerm, setSearchTerm, filteredChains, activeTab, setActiveTab } = useChainContext();
  const { isConnected } = useAccount();

  return (
    <div>
      <div className="flex justify-between items-center gap-2 mb-6">
        <div className="flex space-x-2 bg-gray-50 rounded-xl p-1 w-fit border border-gray-100">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'hot'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hot
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            New
          </button>
        </div>

        <div className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search networks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring focus:ring-gray-300 shadow-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredChains.map((chain: Chain) => (
          <ChainCard
            key={chain.id}
            chain={chain}
            isConnected={isConnected}
          />
        ))}
      </div>
    </div>
  );
};

export default ChainGrid;
