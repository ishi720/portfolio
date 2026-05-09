import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { shallowRef, nextTick } from 'vue'
import type { Article } from '~/types/models'

// usePagination は各テストでデータを差し替えるため vi.hoisted で制御可能にする
const { mockUsePagination } = vi.hoisted(() => ({
  mockUsePagination: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} })
}))

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn()
}))

vi.mock('~/composables/useUtils', () => ({
  formatDate: (date: string) => date,
  parseTags: (tags: string) => (tags ? tags.split(',').map((t: string) => t.trim()) : [])
}))

vi.mock('~/composables/usePagination', () => ({
  usePagination: mockUsePagination,
  getInitialSortState: (key: string) => ({ key, order: 'desc' })
}))

vi.mock('~/composables/useFetchData', async () => {
  const { shallowRef } = await import('vue')
  return {
    useFetchData: () => ({
      data: shallowRef<Article[]>([]),
      error: shallowRef(null),
      fetchData: vi.fn()
    })
  }
})

vi.mock('~/composables/useFilteredList', async () => {
  const { shallowRef } = await import('vue')
  return {
    usePopularTags: () => shallowRef([]),
    filterBySearch: (items: any[]) => items,
    filterByTag: (items: any[]) => items,
    sortByDate: (items: any[]) => items,
    sortByNumber: (items: any[]) => items
  }
})

vi.mock('~/constants', () => ({
  ITEMS_PER_PAGE: 20,
  TOP_TAGS_COUNT: 10,
  PLATFORMS: []
}))

import ArticlesPage from '~/pages/articles.vue'

const makeArticle = (overrides: Partial<Article> = {}): Article => ({
  published_at: '2024-01-01T00:00:00+09:00',
  url: 'https://example.com/article',
  title: 'テスト記事タイトル',
  tags: 'TypeScript,Vue',
  source: 'Qiita',
  likes: 10,
  eyecatch: '',
  ...overrides
})

const NUXT_AUTO_IMPORT_STUBS = {
  SearchBox: true,
  TagFilter: true,
  SortControls: true,
  Pagination: true
}

const mountWithArticles = (articles: Article[]) => {
  mockUsePagination.mockReturnValue({
    currentPage: shallowRef(1),
    totalPages: shallowRef(1),
    paginatedItems: shallowRef(articles)
  })
  return shallowMount(ArticlesPage, {
    global: { stubs: NUXT_AUTO_IMPORT_STUBS }
  })
}

describe('articles.vue', () => {
  beforeEach(() => {
    mockUsePagination.mockReturnValue({
      currentPage: shallowRef(1),
      totalPages: shallowRef(1),
      paginatedItems: shallowRef<Article[]>([])
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  describe('eyecatch 画像表示', () => {
    it('eyecatch URLがある記事は img を表示する', async () => {
      const eyecatchUrl = 'https://example.com/image.png'
      const wrapper = mountWithArticles([
        makeArticle({ source: 'note', eyecatch: eyecatchUrl })
      ])
      await nextTick()

      const img = wrapper.find('.article-eyecatch img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(eyecatchUrl)
    })

    it('eyecatch の alt に記事タイトルが設定される', async () => {
      const title = 'テスト記事のタイトル'
      const wrapper = mountWithArticles([
        makeArticle({ title, source: 'note', eyecatch: 'https://example.com/img.png' })
      ])
      await nextTick()

      expect(wrapper.find('.article-eyecatch img').attributes('alt')).toBe(title)
    })

    it('eyecatch がある場合はプレースホルダーを表示しない', async () => {
      const wrapper = mountWithArticles([
        makeArticle({ source: 'note', eyecatch: 'https://example.com/img.png' })
      ])
      await nextTick()

      expect(wrapper.find('.article-eyecatch-placeholder').exists()).toBe(false)
    })
  })

  describe('eyecatch プレースホルダー表示', () => {
    it('eyecatch がない記事は img を表示しない', async () => {
      const wrapper = mountWithArticles([makeArticle({ source: 'Qiita', eyecatch: '' })])
      await nextTick()

      expect(wrapper.find('.article-eyecatch img').exists()).toBe(false)
    })

    it('eyecatch がない記事はプレースホルダーを表示する', async () => {
      const wrapper = mountWithArticles([makeArticle({ source: 'Qiita', eyecatch: '' })])
      await nextTick()

      expect(wrapper.find('.article-eyecatch-placeholder').exists()).toBe(true)
    })

    it('Qiita 記事のプレースホルダーに qiita クラスがつく', async () => {
      const wrapper = mountWithArticles([makeArticle({ source: 'Qiita', eyecatch: '' })])
      await nextTick()

      expect(wrapper.find('.article-eyecatch-placeholder.qiita').exists()).toBe(true)
    })

    it('Zenn 記事のプレースホルダーに zenn クラスがつく', async () => {
      const wrapper = mountWithArticles([makeArticle({ source: 'Zenn', eyecatch: '' })])
      await nextTick()

      expect(wrapper.find('.article-eyecatch-placeholder.zenn').exists()).toBe(true)
    })

    it('プレースホルダーに記事タイトルが表示される', async () => {
      const title = 'TypeScript で書くテストコードの基本'
      const wrapper = mountWithArticles([makeArticle({ title, source: 'Qiita', eyecatch: '' })])
      await nextTick()

      expect(wrapper.find('.article-eyecatch-placeholder').text()).toContain(title)
    })
  })

  describe('eyecatch あり/なし 混在', () => {
    it('複数記事が正しい数のカードを描画する', async () => {
      const wrapper = mountWithArticles([
        makeArticle({ source: 'note', eyecatch: 'https://example.com/img.png' }),
        makeArticle({ source: 'Qiita', eyecatch: '' }),
        makeArticle({ source: 'Zenn', eyecatch: '' })
      ])
      await nextTick()

      expect(wrapper.findAll('.article-card')).toHaveLength(3)
    })

    it('note は img、Qiita/Zenn はプレースホルダーが表示される', async () => {
      const wrapper = mountWithArticles([
        makeArticle({ source: 'note', eyecatch: 'https://example.com/img.png' }),
        makeArticle({ source: 'Qiita', eyecatch: '' }),
        makeArticle({ source: 'Zenn', eyecatch: '' })
      ])
      await nextTick()

      const cards = wrapper.findAll('.article-card')
      expect(cards[0].find('img').exists()).toBe(true)
      expect(cards[1].find('.article-eyecatch-placeholder.qiita').exists()).toBe(true)
      expect(cards[2].find('.article-eyecatch-placeholder.zenn').exists()).toBe(true)
    })
  })
})
