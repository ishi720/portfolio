# GitHub Actions ワークフロー一覧

## 各ワークフローの概要

### 1. coveralls.yml
テストを実行し、カバレッジをCoverallsにアップロードする。

### 2. deploy.yml
静的サイトを生成し、GitHub Pagesにデプロイする。

### 3. update-articles.yml
[ishi720/getArticle](https://github.com/ishi720/getArticle)をcloneして`get_article.py`を実行し、生成された`combined_articles.json`で`public/data/combined_articles.json`を置き換える。差分がなければコミットしない。

### 4. update-repos.yml
[ishi720/GithubDashboard](https://github.com/ishi720/GithubDashboard)をcloneし、`Documents/repos_list.json`で`public/data/repos_list.json`を置き換える。差分がなければコミットしない。

# 実行タイミング

| ワークフロー | トリガー | タイミング |
|---|---|---|
| 1. [coveralls.yml](coveralls.yml) | `push` | `main`ブランチにpushされるたび |
| 2. [deploy.yml](deploy.yml) | `push` / `workflow_dispatch` | `main`ブランチにpushされるたび／手動実行 |
| 3. [update-articles.yml](update-articles.yml) | `schedule` / `workflow_dispatch` | 毎週**日曜 10:00**（JST）／手動実行 |
| 4. [update-repos.yml](update-repos.yml) | `schedule` / `workflow_dispatch` | 毎週**日曜 3:00**（JST）／手動実行 |

# 実行フロー

データ更新系のワークフローがコミットすると`main`へのpushが発生し、続けて`push`トリガーのワークフローが実行される。

```
3. update-articles.yml → 1. coveralls.yml
3. update-articles.yml → 2. deploy.yml
4. update-repos.yml    → 1. coveralls.yml
4. update-repos.yml    → 2. deploy.yml
```

※ 3・4は差分があった場合のみコミットするため、更新がない週は後続のワークフローも実行されない。

