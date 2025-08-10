import { Match, PaymentStats } from "../types";
import { calculateMatchResults } from "./calculations";
import {
  getFighterPaymentStatus,
  getBettorPaymentStatus,
} from "./paymentStatus";
import { calculateFighterEarnings } from "./fighterCalculations";

/**
 * 全試合から人ごとの支払い統計を計算する
 */
export function calculatePaymentStats(matches: Match[]): PaymentStats[] {
  // 選手賞金を共通関数で計算
  const fighterEarnings = calculateFighterEarnings(matches);

  const personMap = new Map<
    string,
    {
      name: string;
      fighterPrize: number;
      bettorPayout: number;
      entryFees: number;
      betInvestment: number;
      fighterMatches: number;
      bettorMatches: number;
      fighterPayments: boolean[];
      bettorPayments: boolean[];
    }
  >();

  // 選手データを初期化
  fighterEarnings.forEach((earnings, name) => {
    personMap.set(name, {
      name: earnings.name,
      fighterPrize: earnings.totalPrize, // 共通関数の結果を使用
      bettorPayout: 0,
      entryFees: 0,
      betInvestment: 0,
      fighterMatches: earnings.matchCount,
      bettorMatches: 0,
      fighterPayments: [],
      bettorPayments: [],
    });
  });

  // 完了済みの試合のみを対象とする
  const completedMatches = matches.filter(
    (match) => match.isCompleted && match.winnerId
  );

  completedMatches.forEach((match) => {
    const results = calculateMatchResults(match);

    // 結果が計算できない場合はスキップ
    if (!results) return;

    // 投資額と支払い状況の計算
    match.fighters.forEach((fighter) => {
      const key = fighter.name;

      // personMapに存在しない場合は追加（共通関数で処理されていない場合のフォールバック）
      if (!personMap.has(key)) {
        const earnings = fighterEarnings.get(key);
        personMap.set(key, {
          name: fighter.name,
          fighterPrize: earnings?.totalPrize || 0,
          bettorPayout: 0,
          entryFees: 0,
          betInvestment: 0,
          fighterMatches: earnings?.matchCount || 0,
          bettorMatches: 0,
          fighterPayments: [],
          bettorPayments: [],
        });
      }

      const stats = personMap.get(key)!;
      stats.entryFees += match.entryFee; // 参加費を追加

      // 支払い状況
      const isPaid = getFighterPaymentStatus(match, fighter.id);
      stats.fighterPayments.push(isPaid);
    });

    // ベッターとして参加している人（全員の賭け金額を投資額に追加）
    match.bettors.forEach((bettor) => {
      const key = bettor.name;

      if (!personMap.has(key)) {
        personMap.set(key, {
          name: bettor.name,
          fighterPrize: 0,
          bettorPayout: 0,
          entryFees: 0,
          betInvestment: 0,
          fighterMatches: 0,
          bettorMatches: 0,
          fighterPayments: [],
          bettorPayments: [],
        });
      }

      const stats = personMap.get(key)!;
      stats.betInvestment += bettor.betAmount * match.betUnitPrice; // 賭け金額を投資額に追加
    });

    // ベッターとして参加している人（勝利者のみ配当を追加）
    results.winningBettors.forEach((winningBettor) => {
      const key = winningBettor.bettor.name;

      if (!personMap.has(key)) {
        personMap.set(key, {
          name: winningBettor.bettor.name,
          fighterPrize: 0,
          bettorPayout: 0,
          entryFees: 0,
          betInvestment: 0,
          fighterMatches: 0,
          bettorMatches: 0,
          fighterPayments: [],
          bettorPayments: [],
        });
      }

      const stats = personMap.get(key)!;
      stats.bettorMatches += 1;
      stats.bettorPayout +=
        winningBettor.payout + (winningBettor.specialAllowance || 0);

      // 支払い状況
      const isPaid = getBettorPaymentStatus(match, winningBettor.bettor.id);
      stats.bettorPayments.push(isPaid);
    });
  });

  // Map から配列に変換し、統計を計算
  return Array.from(personMap.values())
    .map((stats) => {
      const totalEarnings = stats.fighterPrize + stats.bettorPayout;
      const totalInvestment = stats.entryFees + stats.betInvestment;
      const netProfit = totalEarnings - totalInvestment; // 純益計算（獲得金額 - 参加費 - 賭け投資額）

      // 全体の支払い状況（選手・ベッター両方で一度でも支払い済みがあるか）
      const allPayments = [...stats.fighterPayments, ...stats.bettorPayments];
      const isPaid =
        allPayments.length > 0 && allPayments.some((payment) => payment);

      return {
        name: stats.name,
        fighterPrize: stats.fighterPrize,
        bettorPayout: stats.bettorPayout,
        totalEarnings,
        entryFees: stats.entryFees,
        betInvestment: stats.betInvestment,
        totalInvestment,
        netProfit,
        fighterMatches: stats.fighterMatches,
        bettorMatches: stats.bettorMatches,
        isPaid,
      };
    })
    .sort((a, b) => b.totalEarnings - a.totalEarnings); // 総獲得金額の降順でソート
}
