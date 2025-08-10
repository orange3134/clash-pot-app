import React, { useState } from "react";
import { FighterStats, Match } from "../types";
import { formatCurrency } from "../utils/calculations";
import {
  updateFighterPaymentStatus,
  getFighterPaymentStatus,
} from "../utils/paymentStatus";

interface FighterStatsViewProps {
  fighterStats: FighterStats[];
  matches: Match[];
  onDataUpdate: () => void;
}

const FighterStatsView: React.FC<FighterStatsViewProps> = ({
  fighterStats,
  matches,
  onDataUpdate,
}) => {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // 選手名から支払い状況を取得
  const getFighterPaymentInfo = (fighterName: string) => {
    const fighterMatches = matches.filter(
      (match) =>
        match.isCompleted && match.fighters.some((f) => f.name === fighterName)
    );

    // 選手全体の支払い状況として、全試合で一度でも支払い済みがあるかチェック
    const hasAnyPayment = fighterMatches.some((match) => {
      const fighter = match.fighters.find((f) => f.name === fighterName);
      return fighter ? getFighterPaymentStatus(match, fighter.id) : false;
    });

    return { isPaid: hasAnyPayment, totalMatches: fighterMatches.length };
  };

  const handleGlobalPaymentChange = (fighterName: string, isPaid: boolean) => {
    // 選手の全試合の支払い状況を一括更新
    const fighterMatches = matches.filter(
      (match) =>
        match.isCompleted && match.fighters.some((f) => f.name === fighterName)
    );

    fighterMatches.forEach((match) => {
      const fighter = match.fighters.find((f) => f.name === fighterName);
      if (fighter) {
        updateFighterPaymentStatus(match, fighter.id, isPaid);
      }
    });

    onDataUpdate();
  };
  if (fighterStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-lg">🥊 選手データがありません</div>
        <p className="text-gray-500 mt-2">
          完了済みの試合がある場合、選手の統計が表示されます。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">🥊 選手統計</h2>
            <p className="text-sm text-gray-600 mt-1">
              全試合通算の賞金・戦績統計
            </p>
          </div>
          <button
            onClick={() => setShowPaymentDetails(!showPaymentDetails)}
            className={`px-4 py-2 text-sm rounded-md border ${
              showPaymentDetails
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            {showPaymentDetails ? "支払い詳細を非表示" : "支払い詳細を表示"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                順位
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                選手名
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                試合数
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                勝利数
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                敗北数
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                勝率
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 uppercase tracking-wider bg-primary-50">
                総賞金
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                平均賞金
              </th>
              {showPaymentDetails && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支払い状況
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fighterStats.map((stats, index) => {
              const paymentInfo = getFighterPaymentInfo(stats.name);
              return (
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
                    {stats.matchCount}試合
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {stats.winCount}勝
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {stats.loseCount}敗
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span
                      className={`font-medium ${
                        stats.winRate >= 50 ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {stats.winRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm bg-primary-50">
                    <span className="font-bold text-primary-900">
                      {formatCurrency(stats.totalPrize)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(stats.averagePrize)}
                  </td>
                  {showPaymentDetails && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={paymentInfo.isPaid}
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
                              paymentInfo.isPaid
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {paymentInfo.isPaid ? "支払済み" : "未払い"}
                          </span>
                        </label>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 統計サマリー */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">総選手数:</span>
            <span className="ml-2 font-medium text-gray-900">
              {fighterStats.length}人
            </span>
          </div>
          <div>
            <span className="text-gray-500">総賞金額:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(
                fighterStats.reduce((sum, stats) => sum + stats.totalPrize, 0)
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">総試合数:</span>
            <span className="ml-2 font-medium text-gray-900">
              {fighterStats.reduce((sum, stats) => sum + stats.matchCount, 0)}
              試合
            </span>
          </div>
          <div>
            <span className="text-gray-500">平均勝率:</span>
            <span className="ml-2 font-medium text-gray-900">
              {fighterStats.length > 0
                ? (
                    fighterStats.reduce(
                      (sum, stats) => sum + stats.winRate,
                      0
                    ) / fighterStats.length
                  ).toFixed(1)
                : "0.0"}
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterStatsView;
