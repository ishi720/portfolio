# ishi720 Portfolio

Nuxt.js製のポートフォリオサイトです。


<img width="1320" height="880" alt="localhost_3000_portfolio_career" src="https://github.com/user-attachments/assets/2169153a-92e7-4089-8893-da08c5904855" />


# Badge

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f49aa0ee56264df093952a3aced2fbb0)](https://app.codacy.com/gh/ishi720/portfolio/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)


## ディレクトリ構成

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions デプロイ設定
├── assets/
│   └── scss/
│       └── main.scss                 # グローバルSCSS
├── composables/
│   ├── useCareer.ts                  # 経歴データ
│   ├── useSkillCloud.ts              # ワードクラウド集計
│   └── usePortfolio.ts               # ポートフォリオデータ
├── components/
│   ├── Pagination.vue                # ページネーションコンポーネント
│   ├── SearchBox.vue                 # 検索ボックスコンポーネント
│   ├── TagFilter.vue                 # タグフィルターコンポーネント
│   └── SortControls.vue              # ソートコンポーネント
├── layouts/
│   └── default.vue                   # 共通レイアウト（ヘッダー/フッター）
├── pages/
│   ├── index.vue                     # Home（/）
│   ├── developments.vue              # Developments（/developments）
│   ├── repositories.vue              # Repositories（/repositories）
│   ├── articles.vue                  # Articles（/articles）
│   └── career.vue                    # Career （/career） 
├── public/
│   ├── data/                         # JSONデータファイル置き場
│   │   ├── combined_articles.json    # Articlesに表示するQiita&Zennのデータ
│   │   └── repos_list.json           # Githubのリポジトリデータ
│   └── images/                       # 画像ファイル置き場
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

## ビルド（静的ファイル生成）

```bash
$ npm run generate
```

`.output/public/` に静的ファイルが生成されます。

## デプロイ

mainブランチにpushすると、GitHub Actionsが自動で GitHub Pages にデプロイします。
