import { Match, OrganizationStats } from "../types";
import { calculateMatchResults } from "./calculations";

/**
 * 全試合から運営統計を計算する
 */
export function calculateOrganizationStats(
  matches: Match[]
): OrganizationStats {
  // 完了済みの試合のみを対象とする
  const completedMatches = matches.filter(
    (match) => match.isCompleted && match.winnerId
  );

  let stats: OrganizationStats = {
    totalBetAmount: 0,
    totalPoolAmount: 0,
    totalOrganizerProfit: 0,
    totalFighterPrizeAmount: 0,
    totalEntryFees: 0,
    totalMayorSpecialPrize: 0,
    totalBettorSpecialAllowance: 0,
    matchCount: completedMatches.length,
  };

  completedMatches.forEach((match) => {
    const results = calculateMatchResults(match);

    // 結果が計算できない場合はスキップ
    if (!results) return;

    // 各項目を合計（undefinedやNaNを安全に処理）
    stats.totalBetAmount += isNaN(results.totalBetAmount)
      ? 0
      : results.totalBetAmount;
    stats.totalPoolAmount += isNaN(results.totalPoolAmount)
      ? 0
      : results.totalPoolAmount;
    stats.totalOrganizerProfit += isNaN(results.organizerProfit)
      ? 0
      : results.organizerProfit;
    stats.totalFighterPrizeAmount += isNaN(results.fighterPrizeTotal)
      ? 0
      : results.fighterPrizeTotal;
    stats.totalEntryFees += isNaN(results.totalEntryFee)
      ? 0
      : results.totalEntryFee;
    stats.totalMayorSpecialPrize += isNaN(match.mayorSpecialPrize)
      ? 0
      : match.mayorSpecialPrize || 0;
    stats.totalBettorSpecialAllowance += isNaN(match.bettorSpecialAllowance)
      ? 0
      : match.bettorSpecialAllowance || 0;
  });

  return stats;
}
