/**
 * 共通ユーティリティ関数
 */

/**
 * 日付文字列を YYYY/M/D 形式にフォーマット
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

/**
 * タグを配列として取得する
 * - カンマ区切りの文字列 → 配列に分割
 * - 配列 → そのまま返す
 * - 単一の文字列 → 配列に変換
 */
export const parseTags = (tags: string | string[] | undefined | null): string[] => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  if (tags.includes(',')) {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  }
  return tags.length > 0 ? [tags] : []
}

/**
 * タグ名を表示用ラベルに変換する（言語アイキャッチ用）
 * - language未設定時のタグフォールバック用に、単語ごとに先頭を大文字化する
 */
export const formatLanguageLabel = (tag: string): string => {
  if (!tag) return ''
  return tag
    .split(/[-_ ]+/)
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
