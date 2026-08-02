import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { containsJapanese, useSkillCloud } from '../composables/useSkillCloud'

describe('containsJapanese', () => {
  describe('ひらがな', () => {
    it('ひらがなを含む場合はtrueを返す', () => {
      expect(containsJapanese('あいうえお')).toBe(true)
      expect(containsJapanese('TypeScriptあ')).toBe(true)
      expect(containsJapanese('あTypeScript')).toBe(true)
    })
  })

  describe('カタカナ', () => {
    it('カタカナを含む場合はtrueを返す', () => {
      expect(containsJapanese('アイウエオ')).toBe(true)
      expect(containsJapanese('TypeScriptア')).toBe(true)
      expect(containsJapanese('タイプスクリプト')).toBe(true)
    })
  })

  describe('漢字', () => {
    it('漢字を含む場合はtrueを返す', () => {
      expect(containsJapanese('日本語')).toBe(true)
      expect(containsJapanese('TypeScript開発')).toBe(true)
      expect(containsJapanese('開発環境')).toBe(true)
    })
  })

  describe('英数字・記号のみ', () => {
    it('英字のみの場合はfalseを返す', () => {
      expect(containsJapanese('TypeScript')).toBe(false)
      expect(containsJapanese('Vue.js')).toBe(false)
      expect(containsJapanese('Node.js')).toBe(false)
    })

    it('数字のみの場合はfalseを返す', () => {
      expect(containsJapanese('12345')).toBe(false)
    })

    it('記号を含む場合でも日本語がなければfalseを返す', () => {
      expect(containsJapanese('C++')).toBe(false)
      expect(containsJapanese('C#')).toBe(false)
      expect(containsJapanese('node-sass')).toBe(false)
      expect(containsJapanese('@vue/test-utils')).toBe(false)
    })

    it('空文字の場合はfalseを返す', () => {
      expect(containsJapanese('')).toBe(false)
    })
  })

  describe('混合ケース', () => {
    it('英数字と日本語が混在する場合はtrueを返す', () => {
      expect(containsJapanese('React入門')).toBe(true)
      expect(containsJapanese('Vue3の使い方')).toBe(true)
    })
  })
})

describe('useSkillCloud', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    mockFetch.mockReset()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  describe('初期状態', () => {
    it('isLoadedはfalse、errorはnullで始まる', () => {
      const { isLoaded, error } = useSkillCloud()

      expect(isLoaded.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('loadData前でもportfolio/career由来のタグを集計する', () => {
      const { aggregatedTags } = useSkillCloud()

      expect(aggregatedTags.value.length).toBeGreaterThan(0)
      expect(aggregatedTags.value.every(t => typeof t.text === 'string')).toBe(true)
      expect(aggregatedTags.value.every(t => t.size > 0)).toBe(true)
    })

    it('タグは出現回数の降順でソートされる', () => {
      const { aggregatedTags } = useSkillCloud()

      const sizes = aggregatedTags.value.map(t => t.size)
      const sorted = [...sizes].sort((a, b) => b - a)
      expect(sizes).toEqual(sorted)
    })
  })

  describe('loadData 成功時', () => {
    it('articlesとreposを取得してisLoadedをtrueにする', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('combined_articles.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ tags: 'TypeScript,Vue' }])
          })
        }
        if (url.includes('repos_list.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ tags: ['Go', 'Docker'] }])
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      const { loadData, isLoaded, error, aggregatedTags } = useSkillCloud()
      await loadData()

      expect(isLoaded.value).toBe(true)
      expect(error.value).toBeNull()

      const texts = aggregatedTags.value.map(t => t.text.toLowerCase())
      expect(texts).toContain('typescript')
      expect(texts).toContain('vue')
      expect(texts).toContain('go')
      expect(texts).toContain('docker')
    })

    it('articleのtagsがカンマ区切り文字列としてパースされる', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('combined_articles.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ tags: 'React, Next.js ,GraphQL' }])
          })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      })

      const { loadData, aggregatedTags } = useSkillCloud()
      await loadData()

      const texts = aggregatedTags.value.map(t => t.text)
      expect(texts).toContain('React')
      expect(texts).toContain('Next.js')
      expect(texts).toContain('GraphQL')
    })

    it('repoのtagsが単一文字列の場合も配列として扱われる', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('repos_list.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ tags: 'Rust' }])
          })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      })

      const { loadData, aggregatedTags } = useSkillCloud()
      await loadData()

      const texts = aggregatedTags.value.map(t => t.text)
      expect(texts).toContain('Rust')
    })

    it('日本語タグは集計から除外される', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('combined_articles.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ tags: '入門,Svelte' }])
          })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      })

      const { loadData, aggregatedTags } = useSkillCloud()
      await loadData()

      const texts = aggregatedTags.value.map(t => t.text)
      expect(texts).not.toContain('入門')
      expect(texts).toContain('Svelte')
    })

    it('大文字小文字が異なる同一タグは1つに統合される', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('combined_articles.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ tags: 'typescript' }, { tags: 'TypeScript' }])
          })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      })

      const { loadData, aggregatedTags } = useSkillCloud()
      await loadData()

      const matches = aggregatedTags.value.filter(t => t.text.toLowerCase() === 'typescript')
      expect(matches).toHaveLength(1)
      expect(matches[0].size).toBeGreaterThanOrEqual(2)
    })

    it('articleにtagsが無い場合はスキップされる', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('combined_articles.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ title: 'no tags here' }])
          })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      })

      const { loadData, isLoaded, error } = useSkillCloud()
      await expect(loadData()).resolves.toBeUndefined()

      expect(isLoaded.value).toBe(true)
      expect(error.value).toBeNull()
    })
  })

  describe('loadData 失敗時', () => {
    it('articlesの取得に失敗した場合はerrorが設定される', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('combined_articles.json')) {
          return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve([]) })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      })

      const { loadData, error, isLoaded } = useSkillCloud()
      await loadData()

      expect(error.value).toBe('Failed to load articles')
      expect(isLoaded.value).toBe(true)

      consoleErrorSpy.mockRestore()
    })

    it('reposの取得に失敗した場合はerrorが設定される', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('repos_list.json')) {
          return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve([]) })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      })

      const { loadData, error } = useSkillCloud()
      await loadData()

      expect(error.value).toBe('Failed to load repos')

      consoleErrorSpy.mockRestore()
    })

    it('両方の取得に失敗した場合は両方のエラーメッセージが結合される', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockFetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve([]) })

      const { loadData, error } = useSkillCloud()
      await loadData()

      expect(error.value).toBe('Failed to load articles, repos')

      consoleErrorSpy.mockRestore()
    })

    it('fetch自体が例外を投げた場合もerrorが設定される', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockFetch.mockRejectedValue(new Error('network down'))

      const { loadData, error, isLoaded } = useSkillCloud()
      await loadData()

      expect(error.value).toBe('Failed to load articles, repos')
      expect(isLoaded.value).toBe(true)

      consoleErrorSpy.mockRestore()
    })

    it('loadDataを再度呼ぶとerrorがリセットされる', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockFetch.mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve([]) })
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve([]) })

      const { loadData, error } = useSkillCloud()
      await loadData()
      expect(error.value).not.toBeNull()

      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
      await loadData()
      expect(error.value).toBeNull()

      consoleErrorSpy.mockRestore()
    })
  })
})
