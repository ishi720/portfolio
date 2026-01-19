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
