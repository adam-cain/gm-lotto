import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Chain, chains } from '../lib/chains';

type TabType = 'all' | 'hot' | 'new';

interface ChainContextType {
  chains: readonly Chain[];
  filteredChains: Chain[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
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
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Filter chains based on search term and active tab
  const filteredChains = chains.filter(chain => {
    const matchesSearch = chain.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || chain.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const value = {
    chains,
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