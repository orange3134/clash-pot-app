import { Match, MatchResults } from "../types";

export function calculateMatchResults(match: Match): MatchResults | null {
  if (!match.winnerId || !match.isCompleted) {
    return null;
  }

  // 賭け口数の合計を計算
  const totalBetUnits = match.bettors.reduce(
    (sum, bettor) => sum + bettor.betAmount,
    0
  );

  // 各項目の計算
  const totalBetAmount =
    match.betUnitPrice * totalBetUnits + match.mayorSpecialPrize / 2;
  const totalEntryFee = match.entryFee * 2;
  const totalPoolAmount = totalBetAmount * 0.85;
  const organizerProfit = totalBetAmount * 0.09 + totalEntryFee * 0.4;
  const fighterPrizeTotal = totalBetAmount * 0.06 + totalEntryFee * 0.6;
  const winnerPrize = (fighterPrizeTotal + match.mayorSpecialPrize / 2) * 0.8;
  const loserPrize = (fighterPrizeTotal + match.mayorSpecialPrize / 2) * 0.2;

  // 勝利した選手に賭けた人たちの配当を計算
  const winningBettors = match.bettors
    .filter((bettor) => bettor.fighterId === match.winnerId)
    .map((bettor) => {
      const winningBetUnits = match.bettors
        .filter((b) => b.fighterId === match.winnerId)
        .reduce((sum, b) => sum + b.betAmount, 0);

      const payout =
        winningBetUnits > 0
          ? (totalPoolAmount * bettor.betAmount) / winningBetUnits
          : 0;

      // ベッター特別手当の分配（勝利ベッターの口数に応じて分配）
      const specialAllowance =
        winningBetUnits > 0
          ? (match.bettorSpecialAllowance * bettor.betAmount) / winningBetUnits
          : 0;

      return {
        bettor,
        payout: Math.round(payout * 100) / 100, // 小数点第2位で四捨五入
        specialAllowance: Math.round(specialAllowance * 100) / 100,
      };
    });

  return {
    totalBetAmount: Math.round(totalBetAmount * 100) / 100,
    totalEntryFee: Math.round(totalEntryFee * 100) / 100,
    totalPoolAmount: Math.round(totalPoolAmount * 100) / 100,
    organizerProfit: Math.round(organizerProfit * 100) / 100,
    fighterPrizeTotal: Math.round(fighterPrizeTotal * 100) / 100,
    winnerPrize: Math.round(winnerPrize * 100) / 100,
    loserPrize: Math.round(loserPrize * 100) / 100,
    winningBettors,
  };
}

export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}
