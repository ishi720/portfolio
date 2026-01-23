import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import {
  usePopularTags,
  filterBySearch,
  filterByTag,
  sortByDate,
  sortByNumber,
  sortByString
} from '../composables/useFilteredList'

describe('usePopularTags', () => {
  it('タグを集計して人気順に返す', () => {
    const items = ref([
      { tags: 'TypeScript,Vue' },
      { tags: 'TypeScript,React' },
      { tags: 'Vue' }
    ])

    const popularTags = usePopularTags(
      items,
      (item) => item.tags,
      10
    )

    expect(popularTags.value).toEqual(['TypeScript', 'Vue', 'React'])
  })

  it('limitで返すタグ数を制限する', () => {
    const items = ref([
      { tags: 'A,B,C' },
      { tags: 'A,B' },
      { tags: 'A' }
    ])

    const popularTags = usePopularTags(items, (item) => item.tags, 2)

    expect(popularTags.value).toEqual(['A', 'B'])
  })

  it('空の配列の場合は空を返す', () => {
    const items = ref<{ tags: string }[]>([])
    const popularTags = usePopularTags(items, (item) => item.tags, 10)

    expect(popularTags.value).toEqual([])
  })

  it('配列形式のタグも処理できる', () => {
    const items = ref([
      { tags: ['TypeScript', 'Vue'] },
      { tags: ['TypeScript'] }
    ])

    const popularTags = usePopularTags(
      items,
      (item) => item.tags,
      10
    )

    expect(popularTags.value).toEqual(['TypeScript', 'Vue'])
  })
})

describe('filterBySearch', () => {
  const items = [
    { name: 'TypeScript Guide', desc: 'A guide for TS' },
    { name: 'Vue Tutorial', desc: 'Learn Vue.js' },
    { name: 'React Basics', desc: 'Introduction to React' }
  ]

  it('検索クエリにマッチするアイテムを返す', () => {
    const result = filterBySearch(items, 'vue', (item) => [item.name, item.desc])

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Vue Tutorial')
  })

  it('大文字小文字を区別しない', () => {
    const result = filterBySearch(items, 'TYPESCRIPT', (item) => [item.name])

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('TypeScript Guide')
  })

  it('空のクエリの場合は全て返す', () => {
    const result = filterBySearch(items, '', (item) => [item.name])

    expect(result).toEqual(items)
  })

  it('複数フィールドで検索できる', () => {
    const result = filterBySearch(items, 'guide', (item) => [item.name, item.desc])

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('TypeScript Guide')
  })

  it('マッチしない場合は空配列を返す', () => {
    const result = filterBySearch(items, 'python', (item) => [item.name])

    expect(result).toEqual([])
  })
})

describe('filterByTag', () => {
  const items = [
    { name: 'Item 1', tags: 'TypeScript,Vue' },
    { name: 'Item 2', tags: 'React,TypeScript' },
    { name: 'Item 3', tags: 'Python' }
  ]

  it('指定したタグを含むアイテムを返す', () => {
    const result = filterByTag(items, 'TypeScript', (item) => item.tags)

    expect(result).toHaveLength(2)
    expect(result.map(r => r.name)).toEqual(['Item 1', 'Item 2'])
  })

  it('空のタグの場合は全て返す', () => {
    const result = filterByTag(items, '', (item) => item.tags)

    expect(result).toEqual(items)
  })

  it('マッチしない場合は空配列を返す', () => {
    const result = filterByTag(items, 'Java', (item) => item.tags)

    expect(result).toEqual([])
  })
})

describe('sortByDate', () => {
  const items = [
    { name: 'A', date: '2024-01-15' },
    { name: 'B', date: '2024-03-20' },
    { name: 'C', date: '2024-02-10' }
  ]

  it('降順でソートする（デフォルト）', () => {
    const result = sortByDate(items, (item) => item.date, 'desc')

    expect(result.map(r => r.name)).toEqual(['B', 'C', 'A'])
  })

  it('昇順でソートする', () => {
    const result = sortByDate(items, (item) => item.date, 'asc')

    expect(result.map(r => r.name)).toEqual(['A', 'C', 'B'])
  })

  it('元の配列を変更しない', () => {
    const original = [...items]
    sortByDate(items, (item) => item.date, 'desc')

    expect(items).toEqual(original)
  })
})

describe('sortByNumber', () => {
  const items = [
    { name: 'A', count: 10 },
    { name: 'B', count: 5 },
    { name: 'C', count: 20 }
  ]

  it('降順でソートする（デフォルト）', () => {
    const result = sortByNumber(items, (item) => item.count, 'desc')

    expect(result.map(r => r.name)).toEqual(['C', 'A', 'B'])
  })

  it('昇順でソートする', () => {
    const result = sortByNumber(items, (item) => item.count, 'asc')

    expect(result.map(r => r.name)).toEqual(['B', 'A', 'C'])
  })
})

describe('sortByString', () => {
  const items = [
    { name: 'Banana' },
    { name: 'Apple' },
    { name: 'Cherry' }
  ]

  it('昇順でソートする（デフォルト）', () => {
    const result = sortByString(items, (item) => item.name, 'asc')

    expect(result.map(r => r.name)).toEqual(['Apple', 'Banana', 'Cherry'])
  })

  it('降順でソートする', () => {
    const result = sortByString(items, (item) => item.name, 'desc')

    expect(result.map(r => r.name)).toEqual(['Cherry', 'Banana', 'Apple'])
  })
})
