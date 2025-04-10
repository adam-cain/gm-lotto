export type NetworkStatus = 'hot' | 'new' | 'regular';

export interface Network {
  chainId: number;
  name: string;
  image?: string;
  status: NetworkStatus;
  color?: string;
}

export interface NetworkCardProps {
  network: Network;
  isConnected: boolean;
  onConnect: (chainId: number) => void;
  isLoading?: boolean;
} 