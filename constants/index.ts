/**
 * アプリケーション共通の定数
 */

// ページネーション
export const ITEMS_PER_PAGE = 18

// タグ表示数
export const TOP_TAGS_COUNT = 10
export const TOP_TECHS_COUNT = 15

// プラットフォーム一覧
export const PLATFORMS = [
  { name: 'Qiita', class: 'platform-qiita' },
  { name: 'Zenn', class: 'platform-zenn' },
  { name: 'note', class: 'platform-note' }
] as const
