import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
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
  const setup = (
    articles: Array<{ tags: string }> = [],
    repos: Array<{ tags: string | string[] }> = []
  ) => useSkillCloud(ref(articles), ref(repos))

  describe('portfolio/career由来のタグ', () => {
    it('articles/reposが空でもタグを集計する', () => {
      const { aggregatedTags } = setup()

      expect(aggregatedTags.value.length).toBeGreaterThan(0)
      expect(aggregatedTags.value.every(t => typeof t.text === 'string')).toBe(true)
      expect(aggregatedTags.value.every(t => t.size > 0)).toBe(true)
    })

    it('タグは出現回数の降順でソートされる', () => {
      const { aggregatedTags } = setup()

      const sizes = aggregatedTags.value.map(t => t.size)
      const sorted = [...sizes].sort((a, b) => b - a)
      expect(sizes).toEqual(sorted)
    })
  })

  describe('articles/reposのタグ', () => {
    it('articlesとreposのタグを集計する', () => {
      const { aggregatedTags } = setup([{ tags: 'TypeScript,Vue' }], [{ tags: ['Go', 'Docker'] }])

      const texts = aggregatedTags.value.map(t => t.text.toLowerCase())
      expect(texts).toContain('typescript')
      expect(texts).toContain('vue')
      expect(texts).toContain('go')
      expect(texts).toContain('docker')
    })

    it('articleのtagsがカンマ区切り文字列としてパースされる', () => {
      const { aggregatedTags } = setup([{ tags: 'React, Next.js ,GraphQL' }])

      const texts = aggregatedTags.value.map(t => t.text)
      expect(texts).toContain('React')
      expect(texts).toContain('Next.js')
      expect(texts).toContain('GraphQL')
    })

    it('repoのtagsが単一文字列の場合も配列として扱われる', () => {
      const { aggregatedTags } = setup([], [{ tags: 'Rust' }])

      expect(aggregatedTags.value.map(t => t.text)).toContain('Rust')
    })

    it('日本語タグは集計から除外される', () => {
      const { aggregatedTags } = setup([{ tags: '入門,Svelte' }])

      const texts = aggregatedTags.value.map(t => t.text)
      expect(texts).not.toContain('入門')
      expect(texts).toContain('Svelte')
    })

    it('大文字小文字が異なる同一タグは1つに統合される', () => {
      const { aggregatedTags } = setup([{ tags: 'typescript' }, { tags: 'TypeScript' }])

      const matches = aggregatedTags.value.filter(t => t.text.toLowerCase() === 'typescript')
      expect(matches).toHaveLength(1)
      expect(matches[0].size).toBeGreaterThanOrEqual(2)
    })

    it('articleにtagsが無い場合はスキップされる', () => {
      const { aggregatedTags } = setup([{ title: 'no tags here' } as unknown as { tags: string }])

      expect(aggregatedTags.value.length).toBeGreaterThan(0)
    })

    it('データが更新されると集計し直される', () => {
      const articles = ref<Array<{ tags: string }>>([])
      const { aggregatedTags } = useSkillCloud(articles, ref([]))
      expect(aggregatedTags.value.map(t => t.text)).not.toContain('Elixir')

      articles.value = [{ tags: 'Elixir' }]
      expect(aggregatedTags.value.map(t => t.text)).toContain('Elixir')
    })
  })
})
