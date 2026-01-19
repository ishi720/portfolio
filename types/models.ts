/**
 * 共通の型定義
 */

// ソート関連
export interface SortOption {
  key: string
  label: string
}

export interface SortState {
  key: string
  order: 'asc' | 'desc'
}

// 記事関連
export interface Article {
  published_at: string
  url: string
  title: string
  tags: string
  source: string
  likes: number
}

export interface Platform {
  name: string
  class: string
}

// リポジトリ関連
export interface Repo {
  name: string
  url: string
  tags: string | string[]
  description: string
  created_at: string
  updated_at: string
  commit_count?: number
  size_kb?: number
}
