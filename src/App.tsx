import React, { useState, useEffect } from "react";
import MatchForm from "./components/MatchForm";
import MatchList from "./components/MatchList";
import MatchDetail from "./components/MatchDetail";
import DataManager from "./components/DataManager";
import { Match } from "./types";
import { getMatches, deleteMatch } from "./utils/storage";

type View = "list" | "form" | "detail" | "data";

function App() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = () => {
    const loadedMatches = getMatches();
    // 新しい順にソート
    loadedMatches.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setMatches(loadedMatches);
  };

  const handleMatchSaved = () => {
    loadMatches();
    setCurrentView("list");
    setEditingMatch(null);
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setCurrentView("detail");
  };

  const handleMatchEdit = (match: Match) => {
    setEditingMatch(match);
    setCurrentView("form");
  };

  const handleMatchDelete = (id: string) => {
    deleteMatch(id);
    loadMatches();
  };

  const handleNewMatch = () => {
    setEditingMatch(null);
    setCurrentView("form");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedMatch(null);
    setEditingMatch(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🥊 CLASH POT</h1>
              <span className="ml-3 text-sm text-gray-500">
                格闘大会賞金・賭け集計システム
              </span>
            </div>

            <div className="flex space-x-3">
              {currentView === "list" && (
                <>
                  <button
                    onClick={() => setCurrentView("data")}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    データ管理
                  </button>
                  <button
                    onClick={handleNewMatch}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    新規試合登録
                  </button>
                </>
              )}

              {currentView !== "list" && (
                <button
                  onClick={handleBackToList}
                  className="px-4 py-2 text-primary-600 hover:text-primary-800 border border-primary-600 rounded-md hover:bg-primary-50"
                >
                  試合一覧に戻る
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentView === "list" && (
            <MatchList
              matches={matches}
              onMatchSelect={handleMatchSelect}
              onMatchEdit={handleMatchEdit}
              onMatchDelete={handleMatchDelete}
            />
          )}

          {currentView === "form" && (
            <MatchForm
              onMatchSaved={handleMatchSaved}
              editMatch={editingMatch}
            />
          )}

          {currentView === "detail" && selectedMatch && (
            <MatchDetail match={selectedMatch} onBack={handleBackToList} />
          )}

          {currentView === "data" && <DataManager onDataUpdate={loadMatches} />}
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 CLASH POT - 格闘大会賞金・賭け集計システム
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
