# ishi720 Portfolio

Nuxt.js製のポートフォリオサイトです。

# Badge

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f49aa0ee56264df093952a3aced2fbb0)](https://app.codacy.com/gh/ishi720/portfolio/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)


## ディレクトリ構成

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions デプロイ設定
├── assets/
│   └── scss/
│       └── main.scss        # グローバルSCSS
├── composables/
│   └── usePortfolio.ts     # ポートフォリオデータ
├── components/
│   └── Pagination.vue      # ページナビコンポーネント
├── layouts/
│   └── default.vue         # 共通レイアウト（ヘッダー/フッター）
├── pages/
│   ├── index.vue           # Home（/）
│   ├── developments.vue    # Works（/developments）
│   └── articles.vue        # Articles（/articles）
├── public/
│   ├── data/               # JSONデータファイル置き場
│   └── images/             # 画像ファイル置き場
├── app.vue                 # ルートコンポーネント
├── nuxt.config.ts          # Nuxt設定
└── package.json
```

## 開発

```bash
$ npm install
$ npm run dev
```

## ビルド（静的ファイル生成）

```bash
$ npm run generate
```

`.output/public/` に静的ファイルが生成されます。

## デプロイ

mainブランチにpushすると、GitHub Actionsが自動で GitHub Pages にデプロイします。
