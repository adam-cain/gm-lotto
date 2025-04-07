import React, { createContext, useContext, useState, ReactNode } from 'react';
import { chains } from '../lib/chains';
import { Network, NetworkStatus } from '../types/network';

// Filter chains to only include those with image property
const networks: Network[] = chains.map(chain => {
  // Handle both string and function types for iconUrl
  const imageUrl = typeof chain.iconUrl === 'function' 
    ? undefined  // Skip function values
    : (chain.iconUrl || undefined); // Convert null to undefined
    
  return {
    chainId: chain.id,
    name: chain.name,
    image: imageUrl,
    status: (chain.status as NetworkStatus) || 'regular',
    color: chain.iconBackground ?? "#000"
  };
});

type TabType = 'all' | 'hot' | 'new';

interface NetworkContextType {
  networks: Network[];
  filteredNetworks: Network[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetworkContext = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetworkContext must be used within a NetworkProvider');
  }
  return context;
};

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Filter networks based on search term and active tab
  const filteredNetworks = networks.filter(network => {
    const matchesSearch = network.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || network.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const value = {
    networks,
    filteredNetworks,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}; 