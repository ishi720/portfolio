import type { Article, Repo } from '~/types/models'

const loadArticles = () =>
  import('~/public/data/combined_articles.json').then(m => m.default as Article[])

const loadRepos = () =>
  import('~/public/data/repos_list.json').then(m => m.default as Repo[])

export const useArticles = () =>
  useAsyncData('articles', loadArticles, {
    default: () => [] as Article[],
  })

export const useRepos = () =>
  useAsyncData('repos', loadRepos, {
    default: () => [] as Repo[],
  })

export const useArticleSummaries = () =>
  useAsyncData('article-summaries', loadArticles, {
    default: () => [] as Pick<Article, 'tags' | 'source'>[],
    transform: articles => articles.map(({ tags, source }) => ({ tags, source })),
  })

export const useRepoSummaries = () =>
  useAsyncData('repo-summaries', loadRepos, {
    default: () => [] as Pick<Repo, 'tags'>[],
    transform: repos => repos.map(({ tags }) => ({ tags })),
  })
