# CLASH POT - 格闘大会賞金・賭け集計システム

🥊 格闘大会の選手賞金と観客の賭けを管理・集計するWebアプリケーション

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/clash-pot-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/clash-pot-app/actions/workflows/deploy.yml)

## 🌐 ライブデモ

**[https://YOUR_USERNAME.github.io/clash-pot-app/](https://YOUR_USERNAME.github.io/clash-pot-app/)**

## ✨ 主な機能

### 💰 試合管理
- **選手情報登録**: 常に2名の選手で試合を管理
- **賭け参加者管理**: 名前、賭け口数、賭け先選手を登録
- **基本設定**: 選手参加費、賭けの一口金額、市長特別賞金を設定
- **前回設定コピー**: 新規試合登録時に前回の基本設定をワンクリックでコピー
- **勝者決定**: 試合結果を記録

### 📊 自動計算機能
以下の項目を自動計算します：

- **掛け金総額** = [賭けの一口の金額] × [賭け口数の合計] + [市長特別賞金] / 2
- **選手参加費総額** = [選手参加費] × 2
- **山分け総額** = [掛け金総額] × 0.85
- **主催者利益** = [掛け金総額] × 0.09 + [選手参加費総額] × 0.4
- **選手賞金総額** = [掛け金総額] × 0.06 + [選手参加費総額] × 0.6
- **勝利選手賞金** = ([選手賞金総額] + [市長特別賞金] / 2) × 0.8
- **敗者選手賞金** = ([選手賞金総額] + [市長特別賞金] / 2) × 0.2

### 🏆 配当計算
- 勝利選手に賭けた参加者への配当を自動計算
- 賭け口数に応じた山分け配当
- 敗者に賭けた参加者は配当なし
- 金額は3桁区切り（カンマ区切り）で見やすく表示

### 📱 データ管理
- **ローカル保存**: LocalStorageを使用してブラウザにデータを保存
- **試合履歴**: 過去の試合データを一覧表示
- **詳細表示**: 個別の試合結果と収支詳細を確認
- **編集・削除**: 試合データの編集・削除が可能

## 🛠️ 技術スタック

- **Frontend**: React 18 + TypeScript
- **スタイリング**: Tailwind CSS
- **データ保存**: LocalStorage
- **ビルドツール**: Create React App
- **デプロイ**: GitHub Pages + GitHub Actions

## 🚀 ローカル開発

### 前提条件
- Node.js (v14 以上)
- npm または yarn

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/clash-pot-app.git
cd clash-pot-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

開発サーバーが起動すると、ブラウザで `http://localhost:3000` にアクセスできます。

### ビルド

```bash
# プロダクション用にビルド
npm run build

# GitHub Pagesにデプロイ
npm run deploy
```

## 📋 使用方法

### 1. 新規試合登録
1. 「新規試合登録」ボタンをクリック
2. 選手情報（2名）を入力
3. 基本設定を入力（「前回設定をコピー」で効率化）
4. 賭け参加者を追加し、名前・口数・賭け先を設定
5. 勝者を選択（試合終了後）
6. 「保存」ボタンで試合データを保存

### 2. 試合履歴確認
- トップページで過去の試合一覧を確認
- 試合をクリックして詳細な収支計算結果を表示
- 編集・削除ボタンで試合データを管理

### 3. 計算結果の確認
試合完了後、以下の情報が自動表示されます：
- 総合収支（掛け金総額、山分け総額等）
- 選手賞金（勝者・敗者それぞれ）
- 賭け参加者の配当詳細

## 🏗️ プロジェクト構成

```
src/
├── components/           # Reactコンポーネント
│   ├── MatchForm.tsx    # 試合登録・編集フォーム
│   ├── MatchList.tsx    # 試合一覧表示
│   └── MatchDetail.tsx  # 試合詳細表示
├── types/               # TypeScript型定義
│   └── index.ts         # 基本型定義
├── utils/               # ユーティリティ関数
│   ├── calculations.ts  # 計算ロジック
│   └── storage.ts       # LocalStorage操作
├── App.tsx              # メインアプリケーション
└── index.tsx            # エントリーポイント
```

## 🔧 カスタマイズ

### 計算式の変更
`src/utils/calculations.ts` ファイルの `calculateMatchResults` 関数で計算式を調整できます。

### デザインの変更
Tailwind CSSクラスを使用してデザインをカスタマイズできます。
`tailwind.config.js` でテーマ色などを変更可能です。

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

何かご質問やバグ報告がございましたら、[Issues](https://github.com/YOUR_USERNAME/clash-pot-app/issues) を作成してください。

---

Made with ❤️ for the fighting community 🥊
