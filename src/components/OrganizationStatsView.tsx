import React from "react";
import { OrganizationStats } from "../types";
import { formatCurrency } from "../utils/calculations";

interface OrganizationStatsViewProps {
  organizationStats: OrganizationStats;
}

const OrganizationStatsView: React.FC<OrganizationStatsViewProps> = ({
  organizationStats,
}) => {
  // NaN値を安全に処理するヘルパー関数
  const safeValue = (value: number): number => {
    return isNaN(value) || !isFinite(value) ? 0 : value;
  };

  const statsItems = [
    {
      label: "掛け金総額",
      value: safeValue(organizationStats.totalBetAmount),
      description: "全試合のベッター掛け金の合計",
      color: "blue",
      icon: "💰",
    },
    {
      label: "山分け総額",
      value: safeValue(organizationStats.totalPoolAmount),
      description: "賞金プールとして分配される総額",
      color: "purple",
      icon: "🏆",
    },
    {
      label: "主催者利益",
      value: safeValue(organizationStats.totalOrganizerProfit),
      description: "運営が得る利益の合計",
      color: "green",
      icon: "📈",
    },
    {
      label: "選手賞金総額",
      value: safeValue(organizationStats.totalFighterPrizeAmount),
      description: "選手に支払われる賞金の合計",
      color: "orange",
      icon: "🥊",
    },
    {
      label: "選手参加費",
      value: safeValue(organizationStats.totalEntryFees),
      description: "選手から徴収した参加費の合計",
      color: "red",
      icon: "💸",
    },
    {
      label: "市長特別賞金",
      value: safeValue(organizationStats.totalMayorSpecialPrize),
      description: "市長特別賞として追加された賞金",
      color: "yellow",
      icon: "🏅",
    },
    {
      label: "ベッター特別手当",
      value: safeValue(organizationStats.totalBettorSpecialAllowance),
      description: "ベッターへの特別手当の合計",
      color: "indigo",
      icon: "🎁",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 border-blue-200 text-blue-900",
      purple: "bg-purple-50 border-purple-200 text-purple-900",
      green: "bg-green-50 border-green-200 text-green-900",
      orange: "bg-orange-50 border-orange-200 text-orange-900",
      red: "bg-red-50 border-red-200 text-red-900",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">📊 運営統計</h2>
        <p className="text-sm text-gray-600 mt-1">
          全試合の運営関連数値の統計情報
        </p>
        <div className="mt-2 text-sm text-gray-500">
          対象試合数: {organizationStats.matchCount}試合
        </div>
      </div>

      {/* メイン統計カード */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsItems.map((item) => (
            <div
              key={item.label}
              className={`p-6 rounded-lg border-2 ${getColorClasses(
                item.color
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <div>
                    <h3 className="text-sm font-medium">{item.label}</h3>
                    <p className="text-xs opacity-75 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">
                  {formatCurrency(item.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 収支サマリー */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💼 収支サマリー
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              💰 総収入
            </h4>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(
                safeValue(organizationStats.totalBetAmount) +
                  safeValue(organizationStats.totalEntryFees)
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">掛け金 + 参加費</p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              💸 総支出
            </h4>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(
                safeValue(organizationStats.totalFighterPrizeAmount) +
                  safeValue(organizationStats.totalMayorSpecialPrize) +
                  safeValue(organizationStats.totalBettorSpecialAllowance)
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              選手賞金 + 市長特別賞 + ベッター手当
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              📈 運営純利益
            </h4>
            <p
              className={`text-lg font-bold ${
                safeValue(organizationStats.totalOrganizerProfit) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {safeValue(organizationStats.totalOrganizerProfit) >= 0
                ? "+"
                : ""}
              {formatCurrency(
                safeValue(organizationStats.totalOrganizerProfit)
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">主催者の最終利益</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationStatsView;
