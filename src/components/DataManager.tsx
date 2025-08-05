import React, { useState } from "react";
import { Match } from "../types";
import { getMatches, saveMatch } from "../utils/storage";
import {
  exportMatchesToJSON,
  importMatchesFromJSON,
} from "../utils/dataExport";

interface DataManagerProps {
  onDataUpdate: () => void;
}

export default function DataManager({ onDataUpdate }: DataManagerProps) {
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const handleExport = () => {
    const matches = getMatches();
    if (matches.length === 0) {
      alert("エクスポートする試合データがありません");
      return;
    }

    exportMatchesToJSON(matches);
    setImportMessage("試合データをエクスポートしました");
    setTimeout(() => setImportMessage(null), 3000);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportMessage(null);

    try {
      const importedMatches = await importMatchesFromJSON(file);

      // 確認ダイアログ
      const confirmMessage = `${importedMatches.length}件の試合データをインポートします。\n既存のデータは保持され、重複するIDがある場合は上書きされます。\n\n続行しますか？`;

      if (window.confirm(confirmMessage)) {
        // 既存のデータを取得
        const existingMatches = getMatches();
        const existingIds = new Set(existingMatches.map((m) => m.id));

        // インポートデータをマージ
        let addedCount = 0;
        let updatedCount = 0;

        for (const match of importedMatches) {
          if (existingIds.has(match.id)) {
            updatedCount++;
          } else {
            addedCount++;
          }
          saveMatch(match);
        }

        setImportMessage(
          `インポート完了: ${addedCount}件追加、${updatedCount}件更新`
        );
        onDataUpdate();
      }
    } catch (error) {
      setImportMessage(
        `エラー: ${error instanceof Error ? error.message : "不明なエラー"}`
      );
    } finally {
      setImporting(false);
      // ファイル入力をリセット
      event.target.value = "";
    }
  };

  const handleClearData = () => {
    const confirmMessage =
      "全ての試合データを削除します。\nこの操作は取り消せません。\n\n続行しますか？";

    if (window.confirm(confirmMessage)) {
      localStorage.removeItem("clash-pot-matches");
      setImportMessage("全てのデータを削除しました");
      onDataUpdate();
      setTimeout(() => setImportMessage(null), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">データ管理</h3>

      <div className="space-y-4">
        {/* エクスポート */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <h4 className="font-medium text-blue-900">データエクスポート</h4>
            <p className="text-sm text-blue-700">
              全ての試合データをJSONファイルでダウンロード
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            📥 エクスポート
          </button>
        </div>

        {/* インポート */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div>
            <h4 className="font-medium text-green-900">データインポート</h4>
            <p className="text-sm text-green-700">
              JSONファイルから試合データを読み込み
            </p>
          </div>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={importing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              disabled={importing}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                importing
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {importing ? "📤 処理中..." : "📤 インポート"}
            </button>
          </div>
        </div>

        {/* データクリア */}
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
          <div>
            <h4 className="font-medium text-red-900">データ全削除</h4>
            <p className="text-sm text-red-700">
              全ての試合データを削除（取り消し不可）
            </p>
          </div>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            🗑️ 全削除
          </button>
        </div>

        {/* メッセージ表示 */}
        {importMessage && (
          <div
            className={`p-3 rounded-md ${
              importMessage.includes("エラー")
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {importMessage}
          </div>
        )}
      </div>
    </div>
  );
}
