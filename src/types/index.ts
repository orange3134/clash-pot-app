export interface Fighter {
  id: string;
  name: string;
}

export interface Bettor {
  id: string;
  name: string;
  betAmount: number;
  fighterId: string;
}

export interface Match {
  id: string;
  fighters: [Fighter, Fighter];
  bettors: Bettor[];
  entryFee: number;
  betUnitPrice: number;
  winnerId: string | null;
  mayorSpecialPrize: number;
  createdAt: string;
  isCompleted: boolean;
}

export interface MatchResults {
  totalBetAmount: number;
  totalEntryFee: number;
  totalPoolAmount: number;
  organizerProfit: number;
  fighterPrizeTotal: number;
  winnerPrize: number;
  loserPrize: number;
  winningBettors: Array<{
    bettor: Bettor;
    payout: number;
  }>;
}
