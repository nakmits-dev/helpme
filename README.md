# Help Me

助け合いのためのディスカッションプラットフォーム

## 機能

- メインスレッドとサブスレッドによる階層的なディスカッション
- リアルタイムなコメント投稿
- メールアドレスまたは匿名でのログイン
- モバイルフレンドリーなレスポンシブデザイン
- PWA対応でオフライン利用可能

## 技術スタック

- React + TypeScript
- Vite
- Firebase (Authentication, Firestore)
- TailwindCSS
- PWA

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone https://github.com/yourusername/helpme.git
cd helpme
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
`.env.example`をコピーして`.env`を作成し、Firebaseの設定を追加

4. 開発サーバーの起動
```bash
npm run dev
```

## デプロイ

1. ビルド
```bash
npm run build
```

2. Firebase Hostingへのデプロイ
```bash
firebase deploy
```

## ライセンス

MIT