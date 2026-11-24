import { describe, it, expect } from 'vitest'
import { normalizeSiteUrl } from '../utils/siteUrl'

describe('normalizeSiteUrl', () => {
  it('スキームが無い場合はhttps://を付ける', () => {
    expect(normalizeSiteUrl('example.com')).toBe('https://example.com')
  })

  it('スキームがある場合はそのまま使う', () => {
    expect(normalizeSiteUrl('https://example.com')).toBe('https://example.com')
    expect(normalizeSiteUrl('http://localhost:3000')).toBe('http://localhost:3000')
  })

  it('末尾のスラッシュと前後の空白を取り除く', () => {
    expect(normalizeSiteUrl(' https://example.com/ ')).toBe('https://example.com')
    expect(normalizeSiteUrl('example.com//')).toBe('https://example.com')
  })

  it('未設定の場合は空文字を返す', () => {
    expect(normalizeSiteUrl('')).toBe('')
    expect(normalizeSiteUrl('  ')).toBe('')
    expect(normalizeSiteUrl(undefined)).toBe('')
    expect(normalizeSiteUrl(null)).toBe('')
  })
})
