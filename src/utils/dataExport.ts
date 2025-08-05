import { Match } from "../types";

export function exportMatchesToJSON(matches: Match[]): void {
  const dataStr = JSON.stringify(matches, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clash-pot-matches-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importMatchesFromJSON(file: File): Promise<Match[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const matches = JSON.parse(result) as Match[];

        // データの妥当性チェック
        if (!Array.isArray(matches)) {
          throw new Error("無効なデータ形式です");
        }

        // 各試合データの基本的な妥当性チェック
        for (const match of matches) {
          if (!match.id || !match.fighters || !Array.isArray(match.bettors)) {
            throw new Error("試合データに必要な項目が不足しています");
          }
        }

        resolve(matches);
      } catch (error) {
        reject(
          new Error(
            `ファイルの読み込みに失敗しました: ${
              error instanceof Error ? error.message : "不明なエラー"
            }`
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("ファイルの読み込み中にエラーが発生しました"));
    };

    reader.readAsText(file);
  });
}

export function validateMatchData(match: any): match is Match {
  return (
    typeof match.id === "string" &&
    Array.isArray(match.fighters) &&
    match.fighters.length === 2 &&
    Array.isArray(match.bettors) &&
    typeof match.entryFee === "number" &&
    typeof match.betUnitPrice === "number" &&
    typeof match.mayorSpecialPrize === "number" &&
    typeof match.createdAt === "string" &&
    typeof match.isCompleted === "boolean"
  );
}
