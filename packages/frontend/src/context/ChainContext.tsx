import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Chain, chains } from '../lib/chains';
import { useLotteryStore } from '@/store/lotteryStore';
import { NetworkStatus } from '@/types';

interface ChainContextType {
  chains: readonly Chain[];
  filteredChains: Chain[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: NetworkStatus;
  setActiveTab: (tab: NetworkStatus) => void;
}

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export const useChainContext = () => {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error('useChainContext must be used within a ChainProvider');
  }
  return context;
};

interface ChainProviderProps {
  children: ReactNode;
}

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<NetworkStatus>('all');

  // Get state and actions from the store
  const { 
    chainState,
  } = useLotteryStore();
  
  // Use useMemo to create enriched chains that update when chainState changes
  const enrichedChains = useMemo(() => {
    return chains.map(chain => {
      const lastParticipation = chainState[chain.id]?.lastParticipation || 0;
      return {
        ...chain,
        lastParticipation,
      }
    });
  }, [chainState]);

  // Filter chains based on search term and active tab
  const filteredChains = useMemo(() => {
    let result = enrichedChains.filter(chain => {
      const matchesSearch = chain.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'all' || activeTab === 'recent' || chain.status === activeTab;
      return matchesSearch && matchesTab;
    });
    
    // Sort by lastParticipation (most recent first) if the active tab is 'recent'
    if (activeTab === 'recent') {
      result = result.filter(chain => chain.lastParticipation !== 0);
      result = [...result].sort((a, b) => b.lastParticipation - a.lastParticipation);
    }
    
    return result;
  }, [enrichedChains, searchTerm, activeTab]);

  const value = {
    chains: enrichedChains,
    filteredChains,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab
  };

  return (
    <ChainContext.Provider value={value}>
      {children}
    </ChainContext.Provider>
  );
}; 