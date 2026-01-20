import { describe, it, expect } from 'vitest'
import { formatDate, parseTags } from '../composables/useUtils'

describe('formatDate', () => {
  it('YYYY-MM-DD形式を正しくフォーマットする', () => {
    expect(formatDate('2024-01-15')).toBe('2024/1/15')
  })

  it('YYYY/MM/DD形式を正しくフォーマットする', () => {
    expect(formatDate('2024/03/25')).toBe('2024/3/25')
  })

  it('ISO 8601形式を正しくフォーマットする', () => {
    expect(formatDate('2024-12-31T23:59:59Z')).toBe('2025/1/1') // UTC→JST変換
  })

  it('月・日の先頭ゼロを除去する', () => {
    expect(formatDate('2024-01-01')).toBe('2024/1/1')
    expect(formatDate('2024-09-09')).toBe('2024/9/9')
  })

  it('2桁の月・日をそのまま表示する', () => {
    expect(formatDate('2024-10-15')).toBe('2024/10/15')
    expect(formatDate('2024-12-25')).toBe('2024/12/25')
  })
})

describe('parseTags', () => {
  describe('空・未定義の入力', () => {
    it('undefinedの場合は空配列を返す', () => {
      expect(parseTags(undefined)).toEqual([])
    })

    it('nullの場合は空配列を返す', () => {
      expect(parseTags(null)).toEqual([])
    })

    it('空文字の場合は空配列を返す', () => {
      expect(parseTags('')).toEqual([])
    })
  })

  describe('配列入力', () => {
    it('配列はそのまま返す', () => {
      expect(parseTags(['TypeScript', 'Vue'])).toEqual(['TypeScript', 'Vue'])
    })

    it('空配列はそのまま返す', () => {
      expect(parseTags([])).toEqual([])
    })
  })

  describe('カンマ区切り文字列', () => {
    it('カンマ区切り文字列を配列に分割する', () => {
      expect(parseTags('TypeScript,Vue,Nuxt')).toEqual(['TypeScript', 'Vue', 'Nuxt'])
    })

    it('前後のスペースをトリムする', () => {
      expect(parseTags('TypeScript, Vue , Nuxt')).toEqual(['TypeScript', 'Vue', 'Nuxt'])
    })

    it('空のタグをフィルタリングする', () => {
      expect(parseTags('TypeScript,,Vue')).toEqual(['TypeScript', 'Vue'])
      expect(parseTags(',TypeScript,')).toEqual(['TypeScript'])
    })
  })

  describe('単一文字列', () => {
    it('単一の文字列を配列に変換する', () => {
      expect(parseTags('TypeScript')).toEqual(['TypeScript'])
    })
  })
})
