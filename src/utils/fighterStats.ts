import { Match, FighterStats } from "../types";
import { calculateFighterEarnings } from "./fighterCalculations";

/**
 * 全試合から選手ごとの統計を計算する
 */
export function calculateFighterStats(matches: Match[]): FighterStats[] {
  const fighterEarnings = calculateFighterEarnings(matches);

  // Map から配列に変換し、統計を計算
  return Array.from(fighterEarnings.values())
    .map((stats) => ({
      name: stats.name,
      totalPrize: stats.totalPrize,
      matchCount: stats.matchCount,
      winCount: stats.winCount,
      loseCount: stats.loseCount,
      winRate:
        stats.matchCount > 0 ? (stats.winCount / stats.matchCount) * 100 : 0,
      averagePrize:
        stats.matchCount > 0 ? stats.totalPrize / stats.matchCount : 0,
    }))
    .sort((a, b) => b.totalPrize - a.totalPrize); // 総賞金の降順でソート
}
