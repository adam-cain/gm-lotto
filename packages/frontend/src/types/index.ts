export type Address = `0x${string}`;

export type NetworkStatus = "all" | "hot" | "recent";

export interface RoundInfo {
    roundNumber: number;
    startTime: number;
    ticketCount: number;
    userTicketCount: number;
    pastRounds: {
      roundNumber: number;
      startTime: number;
      isActive: boolean;
      prizeSet: boolean;
      prizeClaimed: boolean;
      winner: Address;
      prizeAmount: number;
    }[];
  }