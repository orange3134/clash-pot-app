import React, { useState } from "react";
import { Match, Fighter, Bettor } from "../types";
import { saveMatch, getMatches } from "../utils/storage";
import { calculateMatchResults, formatCurrency } from "../utils/calculations";

interface MatchFormProps {
  onMatchSaved: () => void;
  editMatch?: Match | null;
}

export default function MatchForm({ onMatchSaved, editMatch }: MatchFormProps) {
  const [fighters, setFighters] = useState<[Fighter, Fighter]>(
    editMatch?.fighters || [
      { id: "1", name: "" },
      { id: "2", name: "" },
    ]
  );
  const [bettors, setBettors] = useState<Bettor[]>(editMatch?.bettors || []);
  const [entryFee, setEntryFee] = useState(editMatch?.entryFee || 0);
  const [betUnitPrice, setBetUnitPrice] = useState(
    editMatch?.betUnitPrice || 0
  );
  const [winnerId, setWinnerId] = useState(editMatch?.winnerId || "");
  const [mayorSpecialPrize, setMayorSpecialPrize] = useState(
    editMatch?.mayorSpecialPrize || 0
  );
  const [bettorSpecialAllowance, setBettorSpecialAllowance] = useState(
    editMatch?.bettorSpecialAllowance || 0
  );

  const addBettor = () => {
    const newBettor: Bettor = {
      id: Date.now().toString(),
      name: "",
      betAmount: 1,
      fighterId: fighters[0].id,
    };
    setBettors([...bettors, newBettor]);
  };

  const copyFromLastMatch = () => {
    const matches = getMatches();
    if (matches.length > 0) {
      // 最新の試合から基本設定をコピー
      const lastMatch = matches[0]; // getMatches()は既に新しい順にソートされている
      setEntryFee(lastMatch.entryFee);
      setBetUnitPrice(lastMatch.betUnitPrice);
      setMayorSpecialPrize(lastMatch.mayorSpecialPrize);
      setBettorSpecialAllowance(lastMatch.bettorSpecialAllowance || 0);
    }
  };

  const updateBettor = (
    index: number,
    field: keyof Bettor,
    value: string | number
  ) => {
    const updatedBettors = [...bettors];
    if (field === "betAmount") {
      updatedBettors[index] = {
        ...updatedBettors[index],
        [field]: Number(value),
      };
    } else {
      updatedBettors[index] = { ...updatedBettors[index], [field]: value };
    }
    setBettors(updatedBettors);
  };

  const removeBettor = (index: number) => {
    setBettors(bettors.filter((_, i) => i !== index));
  };

  const updateFighter = (index: 0 | 1, name: string) => {
    const updatedFighters: [Fighter, Fighter] = [...fighters];
    updatedFighters[index] = { ...updatedFighters[index], name };
    setFighters(updatedFighters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fighters[0].name || !fighters[1].name) {
      alert("選手名を入力してください");
      return;
    }

    if (bettors.some((b) => !b.name || b.betAmount <= 0)) {
      alert("賭け参加者の情報を正しく入力してください");
      return;
    }

    const match: Match = {
      id: editMatch?.id || Date.now().toString(),
      fighters,
      bettors,
      entryFee,
      betUnitPrice,
      winnerId: winnerId || null,
      mayorSpecialPrize,
      bettorSpecialAllowance,
      createdAt: editMatch?.createdAt || new Date().toISOString(),
      isCompleted: !!winnerId,
    };

    saveMatch(match);
    onMatchSaved();

    // フォームをリセット（編集中でない場合）
    if (!editMatch) {
      setFighters([
        { id: "1", name: "" },
        { id: "2", name: "" },
      ]);
      setBettors([]);
      setEntryFee(0);
      setBetUnitPrice(0);
      setWinnerId("");
      setMayorSpecialPrize(0);
      setBettorSpecialAllowance(0);
    }
  };

  const results = winnerId
    ? calculateMatchResults({
        id: "temp",
        fighters,
        bettors,
        entryFee,
        betUnitPrice,
        winnerId,
        mayorSpecialPrize,
        bettorSpecialAllowance,
        createdAt: new Date().toISOString(),
        isCompleted: true,
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {editMatch ? "試合編集" : "新規試合登録"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 選手情報 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">選手情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                選手1
              </label>
              <input
                type="text"
                value={fighters[0].name}
                onChange={(e) => updateFighter(0, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                選手2
              </label>
              <input
                type="text"
                value={fighters[1].name}
                onChange={(e) => updateFighter(1, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
        </div>

        {/* 基本設定 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">基本設定</h3>
            {!editMatch && (
              <button
                type="button"
                onClick={copyFromLastMatch}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                前回設定をコピー
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                選手参加費 ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                賭けの一口金額 ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={betUnitPrice}
                onChange={(e) => setBetUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                市長特別賞金 ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={mayorSpecialPrize}
                onChange={(e) => setMayorSpecialPrize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ベッター特別手当 ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={bettorSpecialAllowance}
                onChange={(e) =>
                  setBettorSpecialAllowance(Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                勝利したベッターの口数に応じて分配されます
              </p>
            </div>
          </div>
        </div>

        {/* 賭け参加者 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">賭け参加者</h3>
            <button
              type="button"
              onClick={addBettor}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              参加者追加
            </button>
          </div>

          {bettors.map((bettor, index) => (
            <div
              key={bettor.id}
              className="flex gap-4 items-end mb-3 p-3 bg-white rounded border"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名前
                </label>
                <input
                  type="text"
                  value={bettor.name}
                  onChange={(e) => updateBettor(index, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  口数
                </label>
                <input
                  type="number"
                  min="1"
                  value={bettor.betAmount}
                  onChange={(e) =>
                    updateBettor(index, "betAmount", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  賭け先
                </label>
                <select
                  value={bettor.fighterId}
                  onChange={(e) =>
                    updateBettor(index, "fighterId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value={fighters[0].id}>
                    {fighters[0].name || "選手1"}
                  </option>
                  <option value={fighters[1].id}>
                    {fighters[1].name || "選手2"}
                  </option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeBettor(index)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                削除
              </button>
            </div>
          ))}
        </div>

        {/* 勝者選択 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">試合結果</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              勝利選手
            </label>
            <select
              value={winnerId}
              onChange={(e) => setWinnerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">-- 選択してください --</option>
              <option value={fighters[0].id}>
                {fighters[0].name || "選手1"}
              </option>
              <option value={fighters[1].id}>
                {fighters[1].name || "選手2"}
              </option>
            </select>
          </div>
        </div>

        {/* 計算結果 */}
        {results && (
          <div className="bg-gold-50 p-4 rounded-lg border border-gold-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              計算結果
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700">掛け金総額</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(results.totalBetAmount)}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700">山分け総額</div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(results.totalPoolAmount)}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700">勝利選手賞金</div>
                <div className="text-lg font-bold text-gold-600">
                  {formatCurrency(results.winnerPrize)}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700">敗者選手賞金</div>
                <div className="text-lg font-bold text-gray-600">
                  {formatCurrency(results.loserPrize)}
                </div>
              </div>
            </div>

            {results.winningBettors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  勝利賭け参加者の配当
                </h4>
                <div className="space-y-2">
                  {results.winningBettors.map((winner, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white p-2 rounded border"
                    >
                      <span className="font-medium">{winner.bettor.name}</span>
                      <span className="text-green-600 font-bold">
                        {formatCurrency(winner.payout)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {editMatch ? "更新" : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
