# ishi720 Portfolio

Nuxt.js製のポートフォリオサイトです。

## ディレクトリ構成

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions デプロイ設定
├── assets/
│   └── css/
│       └── main.css        # グローバルCSS
├── composables/
│   └── usePortfolio.ts     # ポートフォリオデータ
├── layouts/
│   └── default.vue         # 共通レイアウト（ヘッダー/フッター）
├── pages/
│   ├── index.vue           # Home（/）
│   ├── works.vue           # Works（/works）
│   ├── skills.vue          # Skills（/skills）
│   ├── articles.vue        # Articles（/articles）
│   └── contact.vue         # Contact（/contact）
├── public/
│   └── images/             # 画像ファイル置き場
├── app.vue                 # ルートコンポーネント
├── nuxt.config.ts          # Nuxt設定
└── package.json
```

## 開発

```bash
npm install
npm run dev
```

## ビルド（静的ファイル生成）

```bash
npm run generate
```

`.output/public/` に静的ファイルが生成されます。

## デプロイ

mainブランチにpushすると、GitHub Actionsが自動で GitHub Pages にデプロイします。
