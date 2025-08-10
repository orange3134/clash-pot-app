import { Match, FighterStats } from '../types';
import { calculateMatchResults } from './calculations';

/**
 * 全試合から選手ごとの統計を計算する
 */
export function calculateFighterStats(matches: Match[]): FighterStats[] {
  const fighterMap = new Map<string, {
    name: string;
    totalPrize: number;
    matchCount: number;
    winCount: number;
    loseCount: number;
  }>();

  // 完了済みの試合のみを対象とする
  const completedMatches = matches.filter(match => match.isCompleted && match.winnerId);

  completedMatches.forEach(match => {
    const results = calculateMatchResults(match);
    
    // 結果が計算できない場合はスキップ
    if (!results) return;
    
    // 各選手について処理
    match.fighters.forEach(fighter => {
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

  // Map から配列に変換し、統計を計算
  return Array.from(fighterMap.values()).map(stats => ({
    name: stats.name,
    totalPrize: stats.totalPrize,
    matchCount: stats.matchCount,
    winCount: stats.winCount,
    loseCount: stats.loseCount,
    winRate: stats.matchCount > 0 ? (stats.winCount / stats.matchCount) * 100 : 0,
    averagePrize: stats.matchCount > 0 ? stats.totalPrize / stats.matchCount : 0,
  })).sort((a, b) => b.totalPrize - a.totalPrize); // 総賞金の降順でソート
}
