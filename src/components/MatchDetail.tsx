import React from "react";
import { Match } from "../types";
import { calculateMatchResults, formatCurrency } from "../utils/calculations";

interface MatchDetailProps {
  match: Match;
  onBack: () => void;
}

export default function MatchDetail({ match, onBack }: MatchDetailProps) {
  const results = match.isCompleted ? calculateMatchResults(match) : null;
  const winner = match.winnerId
    ? match.fighters.find((f) => f.id === match.winnerId)
    : null;
  const loser = match.winnerId
    ? match.fighters.find((f) => f.id !== match.winnerId)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 text-primary-600 hover:text-primary-800 flex items-center"
      >
        ← 戻る
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">
            {match.fighters[0].name} vs {match.fighters[1].name}
          </h1>
          <p className="text-primary-100">
            開催日: {new Date(match.createdAt).toLocaleDateString("ja-JP")}
          </p>
          {winner && (
            <div className="mt-3 p-3 bg-gold-500 rounded text-white">
              <span className="text-lg font-bold">🏆 勝者: {winner.name}</span>
            </div>
          )}
        </div>

        {/* 基本情報 */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">選手参加費</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(match.entryFee)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">賭けの一口金額</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(match.betUnitPrice)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">市長特別賞金</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(match.mayorSpecialPrize)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">ベッター特別手当</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(match.bettorSpecialAllowance || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* 賭け参加者一覧 */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">賭け参加者一覧</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium text-gray-900">
                    名前
                  </th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">
                    賭け口数
                  </th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">
                    賭け先
                  </th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">
                    賭け金額
                  </th>
                  {results && (
                    <th className="text-left py-2 px-4 font-medium text-gray-900">
                      配当
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {match.bettors.map((bettor, index) => {
                  const fighter = match.fighters.find(
                    (f) => f.id === bettor.fighterId
                  );
                  const isWinner = match.winnerId === bettor.fighterId;
                  const winningBettor = results?.winningBettors.find(
                    (w) => w.bettor.id === bettor.id
                  );
                  const totalPayout = winningBettor
                    ? winningBettor.payout +
                      (winningBettor.specialAllowance || 0)
                    : 0;

                  return (
                    <tr
                      key={bettor.id}
                      className={`border-b ${isWinner ? "bg-green-50" : ""}`}
                    >
                      <td className="py-3 px-4">{bettor.name}</td>
                      <td className="py-3 px-4">{bettor.betAmount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            isWinner
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {fighter?.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(bettor.betAmount * match.betUnitPrice)}
                      </td>
                      {results && (
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold ${
                              isWinner ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isWinner ? formatCurrency(totalPayout) : "$0.00"}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 計算結果 */}
        {results && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">収支計算結果</h2>

            {/* 概要 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">
                  掛け金総額
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(results.totalBetAmount)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <div className="text-sm text-green-600 font-medium">
                  山分け総額
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(results.totalPoolAmount)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">
                  主催者利益
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {formatCurrency(results.organizerProfit)}
                </div>
              </div>
              <div className="bg-gold-50 p-4 rounded border border-gold-200">
                <div className="text-sm text-gold-600 font-medium">
                  選手賞金総額
                </div>
                <div className="text-2xl font-bold text-gold-900">
                  {formatCurrency(results.fighterPrizeTotal)}
                </div>
              </div>
            </div>

            {/* 選手賞金 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gold-50 p-4 rounded border border-gold-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gold-600 font-medium">
                      🏆 勝利選手賞金
                    </div>
                    <div className="text-xl font-bold text-gold-900">
                      {winner?.name}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gold-900">
                    {formatCurrency(results.winnerPrize)}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 font-medium">
                      敗者選手賞金
                    </div>
                    <div className="text-xl font-bold text-gray-700">
                      {loser?.name}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-700">
                    {formatCurrency(results.loserPrize)}
                  </div>
                </div>
              </div>
            </div>

            {/* 勝利賭け参加者の詳細 */}
            {results.winningBettors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  勝利賭け参加者の配当詳細
                </h3>
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <div className="space-y-2">
                    {results.winningBettors.map((winner, index) => (
                      <div key={index} className="bg-white p-3 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {winner.bettor.name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({winner.bettor.betAmount}口 ×{" "}
                              {formatCurrency(match.betUnitPrice)})
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(winner.payout)}
                            </div>
                            {winner.specialAllowance > 0 && (
                              <div className="text-sm text-purple-600">
                                +{formatCurrency(winner.specialAllowance)}{" "}
                                (特別手当)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
