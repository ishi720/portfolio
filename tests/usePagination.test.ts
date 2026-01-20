import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'

// vue-routerをモック
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {}
  }),
  useRouter: () => ({
    replace: vi.fn()
  })
}))

import { usePagination, getInitialSortState } from '../composables/usePagination'

describe('usePagination', () => {
  const createTestItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
  }

  describe('totalPages計算', () => {
    it('アイテム数に基づいて正しいページ数を計算する', () => {
      const items = createTestItems(50)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { totalPages } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      expect(totalPages.value).toBe(5)
    })

    it('端数がある場合は切り上げる', () => {
      const items = createTestItems(25)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { totalPages } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      expect(totalPages.value).toBe(3)
    })

    it('アイテムが0件の場合は0ページを返す', () => {
      const filteredItems = computed(() => [] as Array<{ id: number }>)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { totalPages } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      expect(totalPages.value).toBe(0)
    })
  })

  describe('currentPage制約', () => {
    it('currentPageは1以上の値を返す', () => {
      const items = createTestItems(10)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      expect(currentPage.value).toBeGreaterThanOrEqual(1)
    })

    it('currentPageはtotalPagesを超えない', () => {
      const items = createTestItems(30)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { currentPage, totalPages } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      currentPage.value = 100
      expect(currentPage.value).toBeLessThanOrEqual(totalPages.value)
    })
  })

  describe('paginatedItems', () => {
    it('現在のページのアイテムのみを返す', () => {
      const items = createTestItems(30)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { paginatedItems, currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      // 1ページ目
      expect(paginatedItems.value).toHaveLength(10)
      expect(paginatedItems.value[0].id).toBe(1)
      expect(paginatedItems.value[9].id).toBe(10)

      // 2ページ目
      currentPage.value = 2
      expect(paginatedItems.value).toHaveLength(10)
      expect(paginatedItems.value[0].id).toBe(11)
      expect(paginatedItems.value[9].id).toBe(20)

      // 3ページ目
      currentPage.value = 3
      expect(paginatedItems.value).toHaveLength(10)
      expect(paginatedItems.value[0].id).toBe(21)
      expect(paginatedItems.value[9].id).toBe(30)
    })

    it('最後のページでアイテムが足りない場合は残りのアイテムを返す', () => {
      const items = createTestItems(25)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { paginatedItems, currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      currentPage.value = 3
      expect(paginatedItems.value).toHaveLength(5)
      expect(paginatedItems.value[0].id).toBe(21)
      expect(paginatedItems.value[4].id).toBe(25)
    })
  })
})

describe('getInitialSortState', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('デフォルトのソート状態を返す', async () => {
    // routeのクエリが空の場合
    vi.doMock('vue-router', () => ({
      useRoute: () => ({
        query: {}
      }),
      useRouter: () => ({
        replace: vi.fn()
      })
    }))

    const { getInitialSortState: getState } = await import('../composables/usePagination')
    const sortState = getState('createdAt')

    expect(sortState.key).toBe('createdAt')
    expect(sortState.order).toBe('desc')
  })
})
