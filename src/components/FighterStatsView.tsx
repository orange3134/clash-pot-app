import React from 'react';
import { FighterStats } from '../types';
import { formatCurrency } from '../utils/calculations';

interface FighterStatsViewProps {
  fighterStats: FighterStats[];
}

const FighterStatsView: React.FC<FighterStatsViewProps> = ({ fighterStats }) => {
  if (fighterStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-lg">
          🥊 選手データがありません
        </div>
        <p className="text-gray-500 mt-2">
          完了済みの試合がある場合、選手の統計が表示されます。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          🥊 選手統計
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          全試合通算の賞金・戦績統計
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fighterStats.map((stats, index) => (
              <tr 
                key={stats.name}
                className={index < 3 ? 'bg-gold-50' : 'hover:bg-gray-50'}
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
                  <span className={`font-medium ${
                    stats.winRate >= 50 ? 'text-green-600' : 'text-gray-900'
                  }`}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 統計サマリー */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">総選手数:</span>
            <span className="ml-2 font-medium text-gray-900">{fighterStats.length}人</span>
          </div>
          <div>
            <span className="text-gray-500">総賞金額:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(fighterStats.reduce((sum, stats) => sum + stats.totalPrize, 0))}
            </span>
          </div>
          <div>
            <span className="text-gray-500">総試合数:</span>
            <span className="ml-2 font-medium text-gray-900">
              {fighterStats.reduce((sum, stats) => sum + stats.matchCount, 0)}試合
            </span>
          </div>
          <div>
            <span className="text-gray-500">平均勝率:</span>
            <span className="ml-2 font-medium text-gray-900">
              {fighterStats.length > 0 
                ? (fighterStats.reduce((sum, stats) => sum + stats.winRate, 0) / fighterStats.length).toFixed(1)
                : '0.0'
              }%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterStatsView;
