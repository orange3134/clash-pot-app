import React from 'react';
import { Match } from '../types';
import { calculateMatchResults, formatCurrency } from '../utils/calculations';

interface MatchListProps {
  matches: Match[];
  onMatchSelect: (match: Match) => void;
  onMatchEdit: (match: Match) => void;
  onMatchDelete: (id: string) => void;
}

export default function MatchList({ matches, onMatchSelect, onMatchEdit, onMatchDelete }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🥊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">試合データがありません</h3>
        <p className="text-gray-500">新しい試合を登録してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">試合一覧</h2>
      
      {matches.map((match) => {
        const results = match.isCompleted ? calculateMatchResults(match) : null;
        const winner = match.winnerId ? match.fighters.find(f => f.id === match.winnerId) : null;
        
        return (
          <div
            key={match.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onMatchSelect(match)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {match.fighters[0].name} vs {match.fighters[1].name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(match.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMatchEdit(match);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    編集
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('この試合を削除しますか？')) {
                        onMatchDelete(match.id);
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    削除
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">参加費:</span>
                  <span className="ml-1 font-medium">{formatCurrency(match.entryFee)}</span>
                </div>
                <div>
                  <span className="text-gray-500">一口:</span>
                  <span className="ml-1 font-medium">{formatCurrency(match.betUnitPrice)}</span>
                </div>
                <div>
                  <span className="text-gray-500">賭け参加者:</span>
                  <span className="ml-1 font-medium">{match.bettors.length}名</span>
                </div>
                <div>
                  <span className="text-gray-500">状態:</span>
                  <span className={`ml-1 font-medium ${match.isCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                    {match.isCompleted ? '完了' : '進行中'}
                  </span>
                </div>
              </div>
              
              {winner && (
                <div className="mt-3 p-3 bg-gold-50 rounded border border-gold-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gold-800">🏆 勝者: {winner.name}</span>
                    {results && (
                      <span className="text-gold-700 font-bold">
                        賞金: {formatCurrency(results.winnerPrize)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
