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
  bettorSpecialAllowance: number; // ベッター特別手当
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
    specialAllowance: number; // ベッター特別手当の分配額
  }>;
}

export interface BettorStats {
  name: string;
  totalBetAmount: number; // 賭け口数の合計
  totalPayout: number;
  netResult: number;
  matchCount: number;
  winCount: number;
  winRate: number;
}

export interface FighterStats {
  name: string;
  totalPrize: number;
  matchCount: number;
  winCount: number;
  loseCount: number;
  winRate: number;
  averagePrize: number;
}
