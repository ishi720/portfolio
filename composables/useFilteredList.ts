import { computed, type Ref } from 'vue'
import { parseTags } from './useUtils'
import { TOP_TAGS_COUNT } from '~/constants'

/**
 * タグを集計して人気順に返す
 */
export const usePopularTags = <T>(
  items: Ref<T[]>,
  getTagsFromItem: (item: T) => string | string[] | undefined,
  limit: number = TOP_TAGS_COUNT
) => {
  return computed(() => {
    const tagCount: Record<string, number> = {}

    items.value.forEach(item => {
      const tags = getTagsFromItem(item)
      parseTags(tags).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })

    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag)
  })
}

/**
 * 検索クエリでアイテムをフィルタリング
 */
export const filterBySearch = <T>(
  items: T[],
  query: string,
  getSearchableFields: (item: T) => (string | undefined)[]
): T[] => {
  if (!query) return items

  const lowerQuery = query.toLowerCase()
  return items.filter(item => {
    const fields = getSearchableFields(item)
    return fields.some(field => field?.toLowerCase().includes(lowerQuery))
  })
}

/**
 * タグでアイテムをフィルタリング
 */
export const filterByTag = <T>(
  items: T[],
  tag: string,
  getTagsFromItem: (item: T) => string | string[] | undefined
): T[] => {
  if (!tag) return items

  return items.filter(item => {
    const tags = getTagsFromItem(item)
    return parseTags(tags).includes(tag)
  })
}

/**
 * 日付でソート
 */
export const sortByDate = <T>(
  items: T[],
  getDate: (item: T) => string,
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(getDate(a)).getTime()
    const dateB = new Date(getDate(b)).getTime()
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

/**
 * 数値でソート
 */
export const sortByNumber = <T>(
  items: T[],
  getValue: (item: T) => number,
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const valA = getValue(a)
    const valB = getValue(b)
    return order === 'desc' ? valB - valA : valA - valB
  })
}

/**
 * 文字列でソート
 */
export const sortByString = <T>(
  items: T[],
  getValue: (item: T) => string,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...items].sort((a, b) => {
    const comparison = getValue(a).localeCompare(getValue(b))
    return order === 'desc' ? -comparison : comparison
  })
}
