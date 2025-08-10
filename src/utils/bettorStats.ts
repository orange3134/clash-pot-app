import { Match, BettorStats } from "../types";
import { calculateMatchResults } from "./calculations";

/**
 * 全試合から賭け参加者ごとの統計を計算する
 */
export function calculateBettorStats(matches: Match[]): BettorStats[] {
  const bettorMap = new Map<
    string,
    {
      name: string;
      totalBetAmount: number; // 賭け口数の合計
      totalBetMoney: number; // 実際の賭け金額の合計
      totalPayout: number;
      matchCount: number;
      winCount: number;
    }
  >();

  // 完了済みの試合のみを対象とする
  const completedMatches = matches.filter(
    (match) => match.isCompleted && match.winnerId
  );

  completedMatches.forEach((match) => {
    const results = calculateMatchResults(match);

    // 結果が計算できない場合はスキップ
    if (!results) return;

    // 各賭け参加者について処理
    match.bettors.forEach((bettor) => {
      const key = bettor.name;

      if (!bettorMap.has(key)) {
        bettorMap.set(key, {
          name: bettor.name,
          totalBetAmount: 0,
          totalBetMoney: 0,
          totalPayout: 0,
          matchCount: 0,
          winCount: 0,
        });
      }

      const stats = bettorMap.get(key)!;
      stats.totalBetAmount += bettor.betAmount; // 口数
      stats.totalBetMoney += bettor.betAmount * match.betUnitPrice; // 実際の金額
      stats.matchCount += 1;

      // 勝利配当をチェック
      const winningBettor = results.winningBettors.find(
        (wb) => wb.bettor.id === bettor.id
      );
      if (winningBettor) {
        // 通常の配当とベッター特別手当を合計
        const totalWinnings = winningBettor.payout + (winningBettor.specialAllowance || 0);
        stats.totalPayout += totalWinnings;
        stats.winCount += 1;
      }
    });
  });

  // Map から配列に変換し、統計を計算
  return Array.from(bettorMap.values())
    .map((stats) => ({
      name: stats.name,
      totalBetAmount: stats.totalBetAmount, // 口数として表示
      totalPayout: isNaN(stats.totalPayout) ? 0 : stats.totalPayout,
      netResult: isNaN(stats.totalPayout - stats.totalBetMoney) ? -stats.totalBetMoney : stats.totalPayout - stats.totalBetMoney,
      matchCount: stats.matchCount,
      winCount: stats.winCount,
      winRate:
        stats.matchCount > 0 ? (stats.winCount / stats.matchCount) * 100 : 0,
    }))
    .sort((a, b) => b.netResult - a.netResult); // 純利益の降順でソート
}
