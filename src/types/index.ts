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
  paymentStatus?: {
    fighters: { [fighterId: string]: boolean }; // 選手への支払い状況
    bettors: { [bettorId: string]: boolean }; // ベッターへの支払い状況
  };
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

export interface PaymentStats {
  name: string;
  fighterPrize: number; // 選手として獲得した賞金
  bettorPayout: number; // ベッターとして獲得した配当
  totalEarnings: number; // 総獲得金額
  entryFees: number; // 支払った参加費の合計
  betInvestment: number; // 賭けに投じた金額
  totalInvestment: number; // 総投資額（参加費 + 賭け金額）
  netProfit: number; // 純益（総獲得 - 総投資）
  fighterMatches: number; // 選手として参加した試合数
  bettorMatches: number; // ベッターとして参加した試合数
  isPaid: boolean; // 全体の支払い状況
}
