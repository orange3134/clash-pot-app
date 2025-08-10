import React, { useState } from 'react';
import { BettorStats, Match } from '../types';
import { formatCurrency } from '../utils/calculations';
import { updateBettorPaymentStatus, getBettorPaymentStatus } from '../utils/paymentStatus';

interface BettorStatsViewProps {
  bettorStats: BettorStats[];
  matches: Match[];
  onDataUpdate: () => void;
}

const BettorStatsView: React.FC<BettorStatsViewProps> = ({ bettorStats, matches, onDataUpdate }) => {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // ベッター名から支払い状況を取得（勝利時のみ）
  const getBettorPaymentInfo = (bettorName: string) => {
    const bettorMatches = matches.filter(match => 
      match.isCompleted && match.bettors.some(b => b.name === bettorName && b.fighterId === match.winnerId)
    );
    
    // ベッター全体の支払い状況として、全勝利で一度でも支払い済みがあるかチェック
    const hasAnyPayment = bettorMatches.some(match => {
      const bettor = match.bettors.find(b => b.name === bettorName && b.fighterId === match.winnerId);
      return bettor ? getBettorPaymentStatus(match, bettor.id) : false;
    });
    
    return { isPaid: hasAnyPayment, totalWins: bettorMatches.length };
  };

  const handleGlobalPaymentChange = (bettorName: string, isPaid: boolean) => {
    // ベッターの全勝利試合の支払い状況を一括更新
    const bettorMatches = matches.filter(match => 
      match.isCompleted && match.bettors.some(b => b.name === bettorName && b.fighterId === match.winnerId)
    );
    
    bettorMatches.forEach(match => {
      const bettor = match.bettors.find(b => b.name === bettorName && b.fighterId === match.winnerId);
      if (bettor) {
        updateBettorPaymentStatus(match, bettor.id, isPaid);
      }
    });
    
    onDataUpdate();
  };
  if (bettorStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-lg">
          📊 賭け参加者のデータがありません
        </div>
        <p className="text-gray-500 mt-2">
          完了済みの試合がある場合、賭け参加者の統計が表示されます。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              📊 賭け参加者統計
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              全試合通算の賭け金額・配当・収支統計
            </p>
          </div>
          <button
            onClick={() => setShowPaymentDetails(!showPaymentDetails)}
            className={`px-4 py-2 text-sm rounded-md border ${
              showPaymentDetails
                ? 'bg-green-50 text-green-700 border-green-300'
                : 'bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            {showPaymentDetails ? '支払い詳細を非表示' : '支払い詳細を表示'}
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
                参加者名
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                参加試合数
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                勝利回数
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                勝率
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                総賭け口数
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 uppercase tracking-wider bg-primary-50">
                総配当
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                純損益
              </th>
              {showPaymentDetails && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支払い状況
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bettorStats.map((stats, index) => {
              const paymentInfo = getBettorPaymentInfo(stats.name);
              return (
                <tr 
                  key={stats.name}
                  className={index < 3 ? "bg-yellow-50" : "hover:bg-gray-50"}
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
                    {stats.matchCount}回
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {stats.winCount}回
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {stats.totalBetAmount}口
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm bg-primary-50">
                    <span className="font-bold text-primary-900">
                      {formatCurrency(stats.totalPayout)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {stats.netResult > 0 && "+"}
                    {formatCurrency(stats.netResult)}
                  </td>
                  {showPaymentDetails && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={paymentInfo.isPaid}
                            onChange={(e) => handleGlobalPaymentChange(stats.name, e.target.checked)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className={`text-sm font-medium ${
                            paymentInfo.isPaid ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {paymentInfo.isPaid ? '支払済み' : '未払い'}
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
            <span className="text-gray-500">総参加者数:</span>
            <span className="ml-2 font-medium text-gray-900">
              {bettorStats.length}人
            </span>
          </div>
          <div>
            <span className="text-gray-500">総賭け口数:</span>
            <span className="ml-2 font-medium text-gray-900">
              {bettorStats.reduce(
                (sum, stats) => sum + stats.totalBetAmount,
                0
              )}
              口
            </span>
          </div>
          <div>
            <span className="text-gray-500">総配当:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(
                bettorStats.reduce((sum, stats) => sum + stats.totalPayout, 0)
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">平均勝率:</span>
            <span className="ml-2 font-medium text-gray-900">
              {bettorStats.length > 0
                ? (
                    bettorStats.reduce((sum, stats) => sum + stats.winRate, 0) /
                    bettorStats.length
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

export default BettorStatsView;
