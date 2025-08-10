import React, { useState } from "react";
import { PaymentStats, Match } from "../types";
import { formatCurrency } from "../utils/calculations";
import {
  updateFighterPaymentStatus,
  updateBettorPaymentStatus,
  getFighterPaymentStatus,
  getBettorPaymentStatus,
} from "../utils/paymentStatus";

interface PaymentStatsViewProps {
  paymentStats: PaymentStats[];
  matches: Match[];
  onDataUpdate: () => void;
}

const PaymentStatsView: React.FC<PaymentStatsViewProps> = ({
  paymentStats,
  matches,
  onDataUpdate,
}) => {
  if (paymentStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-lg">💰 支払いデータがありません</div>
        <p className="text-gray-500 mt-2">
          完了済みの試合がある場合、支払い統計が表示されます。
        </p>
      </div>
    );
  }

  const handleGlobalPaymentChange = (personName: string, isPaid: boolean) => {
    // その人の全ての選手・ベッター支払い状況を一括更新
    const completedMatches = matches.filter((match) => match.isCompleted);

    completedMatches.forEach((match) => {
      // 選手として参加している場合
      const fighter = match.fighters.find((f) => f.name === personName);
      if (fighter) {
        updateFighterPaymentStatus(match, fighter.id, isPaid);
      }

      // ベッターとして勝利している場合
      const winningBettor = match.bettors.find(
        (b) => b.name === personName && b.fighterId === match.winnerId
      );
      if (winningBettor) {
        updateBettorPaymentStatus(match, winningBettor.id, isPaid);
      }
    });

    onDataUpdate();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">💰 支払い統計</h2>
        <p className="text-sm text-gray-600 mt-1">
          人ごとの総払い出し金額と支払い状況
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                順位
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                氏名
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                選手賞金
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ベッター配当
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 uppercase tracking-wider bg-primary-50">
                総獲得金額
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider bg-red-50">
                参加費
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                賭け投資額
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                総投資額
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-green-700 uppercase tracking-wider bg-green-50">
                純益
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                参加形態
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                支払い状況
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentStats.map((stats, index) => (
              <tr
                key={stats.name}
                className={index < 3 ? "bg-gold-50" : "hover:bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                    {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                    {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                    <span className="text-sm font-medium text-gray-900">
                      {index + 1}位
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {stats.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {stats.fighterPrize > 0
                    ? formatCurrency(stats.fighterPrize)
                    : "-"}
                  {stats.fighterMatches > 0 && (
                    <div className="text-xs text-gray-500">
                      {stats.fighterMatches}試合
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {stats.bettorPayout > 0
                    ? formatCurrency(stats.bettorPayout)
                    : "-"}
                  {stats.bettorMatches > 0 && (
                    <div className="text-xs text-gray-500">
                      {stats.bettorMatches}勝利
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm bg-primary-50">
                  <span className="font-bold text-primary-900">
                    {formatCurrency(stats.totalEarnings)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm bg-red-50">
                  <span className="font-medium text-red-800">
                    {stats.entryFees > 0
                      ? formatCurrency(stats.entryFees)
                      : "-"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {stats.betInvestment > 0
                    ? formatCurrency(stats.betInvestment)
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {stats.totalInvestment > 0
                    ? formatCurrency(stats.totalInvestment)
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm bg-green-50">
                  <span
                    className={`font-bold ${
                      stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stats.netProfit >= 0 ? "+" : ""}
                    {formatCurrency(stats.netProfit)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <div className="flex justify-center space-x-1">
                    {stats.fighterMatches > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        選手
                      </span>
                    )}
                    {stats.bettorMatches > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        ベッター
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <div className="flex items-center justify-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={stats.isPaid}
                        onChange={(e) =>
                          handleGlobalPaymentChange(
                            stats.name,
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span
                        className={`text-sm font-medium ${
                          stats.isPaid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stats.isPaid ? "支払済み" : "未払い"}
                      </span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 統計サマリー */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-8 gap-4 text-sm">
          <div>
            <span className="text-gray-500">総人数:</span>
            <span className="ml-2 font-medium text-gray-900">
              {paymentStats.length}人
            </span>
          </div>
          <div>
            <span className="text-gray-500">総獲得額:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(
                paymentStats.reduce(
                  (sum, stats) => sum + stats.totalEarnings,
                  0
                )
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">総参加費:</span>
            <span className="ml-2 font-medium text-red-600">
              {formatCurrency(
                paymentStats.reduce((sum, stats) => sum + stats.entryFees, 0)
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">総賭け額:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(
                paymentStats.reduce(
                  (sum, stats) => sum + stats.betInvestment,
                  0
                )
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">総投資額:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(
                paymentStats.reduce(
                  (sum, stats) => sum + stats.totalInvestment,
                  0
                )
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">総純益:</span>
            <span
              className={`ml-2 font-medium ${
                paymentStats.reduce((sum, stats) => sum + stats.netProfit, 0) >=
                0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(
                paymentStats.reduce((sum, stats) => sum + stats.netProfit, 0)
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">支払済み:</span>
            <span className="ml-2 font-medium text-gray-900">
              {paymentStats.filter((stats) => stats.isPaid).length}人
            </span>
          </div>
          <div>
            <span className="text-gray-500">未払い:</span>
            <span className="ml-2 font-medium text-gray-900">
              {paymentStats.filter((stats) => !stats.isPaid).length}人
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatsView;
