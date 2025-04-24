export type Address = `0x${string}`;

export interface RoundInfo {
    roundNumber: number;
    startTime: number;
    ticketCount: number;
    userTicketCount: number;
    pastRounds: {
      firstTokenId: number;
      roundNumber: number;
      startTime: number;
      isActive: boolean;
      prizeSet: boolean;
      prizeClaimed: boolean;
      winner: Address;
      prizeAmount: number;
      winningTicketId: number;
    }[];
  }