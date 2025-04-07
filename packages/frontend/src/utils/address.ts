/**
 * Format an Ethereum address for display by truncating the middle portion
 * @param address The full Ethereum address
 * @param startLength Number of characters to keep at the start (default 6)
 * @param endLength Number of characters to keep at the end (default 4)
 * @returns Formatted address string (e.g., "0x1234...5678")
 */
export const formatAddress = (
  address: string | undefined, 
  startLength: number = 6, 
  endLength: number = 4
): string => {
  if (!address) return '';
  if (address.length < startLength + endLength) return address;
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}; 