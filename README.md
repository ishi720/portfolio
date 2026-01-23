# ishi720 Portfolio

Nuxt.js製のポートフォリオサイトです。


<img width="1320" height="880" alt="localhost_3000_portfolio_career" src="https://github.com/user-attachments/assets/2169153a-92e7-4089-8893-da08c5904855" />


# Badge

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f49aa0ee56264df093952a3aced2fbb0)](https://app.codacy.com/gh/ishi720/portfolio/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Coverage Status](https://coveralls.io/repos/github/ishi720/portfolio/badge.svg?branch=main)](https://coveralls.io/github/ishi720/portfolio?branch=main)


## ディレクトリ構成

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions デプロイ設定
├── assets/
│   └── scss/
│       ├── _variables.scss           # SCSS変数定義
│       ├── _mixins.scss              # SCSSミックスイン
│       └── main.scss                 # グローバルSCSS
├── components/
│   ├── Pagination.vue                # ページネーションコンポーネント
│   ├── SearchBox.vue                 # 検索ボックスコンポーネント
│   ├── SortControls.vue              # ソートコンポーネント
│   ├── TagFilter.vue                 # タグフィルターコンポーネント
│   └── WordCloud.vue                 # ワードクラウドコンポーネント
├── composables/
│   ├── useCareer.ts                  # 経歴データ
│   ├── usePagination.ts              # ページネーション共通ロジック
│   ├── usePortfolio.ts               # ポートフォリオデータ
│   ├── useSkillCloud.ts              # ワードクラウド集計
│   └── useUtils.ts                   # 共通ユーティリティ関数
├── constants/
│   └── index.ts                      # アプリケーション共通定数
├── layouts/
│   └── default.vue                   # 共通レイアウト（ヘッダー/フッター）
├── pages/
│   ├── index.vue                     # Home（/）
│   ├── articles.vue                  # Articles（/articles）
│   ├── career.vue                    # Career（/career）
│   ├── developments.vue              # Developments（/developments）
│   └── repositories.vue              # Repositories（/repositories）
├── public/
│   ├── data/                         # JSONデータファイル置き場
│   │   ├── combined_articles.json    # Articlesに表示するQiita&Zennのデータ
│   │   └── repos_list.json           # Githubのリポジトリデータ
│   └── images/                       # 画像ファイル置き場
├── types/
│   └── models.ts                     # 共通の型定義
├── app.vue                           # ルートコンポーネント
├── nuxt.config.ts                    # Nuxt設定
└── package.json
```

## データ更新

### Articlesのデータ

- [https://github.com/ishi720/getArticle](https://github.com/ishi720/getArticle) で作成
- `public/data/combined_articles.json` を更新

### Githubのリポジトリのデータ

- [https://github.com/ishi720/GithubDashboard](https://github.com/ishi720/GithubDashboard) で作成
- `public/data/repos_list.json` を更新

## 開発

```bash
$ npm install
$ npm run dev
```

## テスト

```bash
# ウォッチモードで実行
$ npm test

# 1回だけ実行
$ npm run test:run
```

## ビルド（静的ファイル生成）

```bash
$ npm run generate
```

`.output/public/` に静的ファイルが生成されます。

## デプロイ

mainブランチにpushすると、GitHub Actionsが自動で GitHub Pages にデプロイします。
