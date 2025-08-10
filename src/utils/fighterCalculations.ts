import { Match } from "../types";
import { calculateMatchResults } from "./calculations";

/**
 * 選手の賞金計算の共通ロジック
 * 選手統計と支払い統計で同じ計算を使用するため
 */
export interface FighterEarnings {
  name: string;
  totalPrize: number;
  matchCount: number;
  winCount: number;
  loseCount: number;
}

/**
 * 全試合から選手ごとの賞金を計算する共通関数
 */
export function calculateFighterEarnings(
  matches: Match[]
): Map<string, FighterEarnings> {
  const fighterMap = new Map<string, FighterEarnings>();

  // 完了済みの試合のみを対象とする
  const completedMatches = matches.filter(
    (match) => match.isCompleted && match.winnerId
  );

  completedMatches.forEach((match) => {
    const results = calculateMatchResults(match);

    // 結果が計算できない場合はスキップ
    if (!results) return;

    // 各選手について処理
    match.fighters.forEach((fighter) => {
      const key = fighter.name;

      if (!fighterMap.has(key)) {
        fighterMap.set(key, {
          name: fighter.name,
          totalPrize: 0,
          matchCount: 0,
          winCount: 0,
          loseCount: 0,
        });
      }

      const stats = fighterMap.get(key)!;
      stats.matchCount += 1;

      // 勝敗判定と賞金計算
      if (fighter.id === match.winnerId) {
        stats.winCount += 1;
        stats.totalPrize += results.winnerPrize;
      } else {
        stats.loseCount += 1;
        stats.totalPrize += results.loserPrize;
      }
    });
  });

  return fighterMap;
}
