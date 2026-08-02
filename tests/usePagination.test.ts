import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed, nextTick } from 'vue'

// vue-routerをモック
const mockReplace = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {}
  }),
  useRouter: () => ({
    replace: mockReplace
  })
}))

import { usePagination, getInitialSortState } from '../composables/usePagination'

describe('usePagination', () => {
  const createTestItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
  }

  beforeEach(() => {
    mockReplace.mockClear()
  })

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

  describe('updateQuery', () => {
    it('sortStateがdefaultSortKeyと異なる場合はquery.sortを含める', () => {
      const items = createTestItems(10)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'name', order: 'desc' as const })

      const { currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      // setterを呼びupdateQueryを発火させる
      currentPage.value = 1

      expect(mockReplace).toHaveBeenCalledWith({
        query: expect.objectContaining({ sort: 'name' })
      })
    })

    it('sortStateのorderがdesc以外の場合はquery.orderを含める', () => {
      const items = createTestItems(10)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'asc' as const })

      const { currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      currentPage.value = 1

      expect(mockReplace).toHaveBeenCalledWith({
        query: expect.objectContaining({ order: 'asc' })
      })
    })

    it('sortStateがデフォルトの場合はquery.sort/query.orderを含めない', () => {
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

      currentPage.value = 2

      const calledQuery = mockReplace.mock.calls[0][0].query
      expect(calledQuery.sort).toBeUndefined()
      expect(calledQuery.order).toBeUndefined()
      expect(calledQuery.page).toBe('2')
    })

    it('currentPageが1の場合はquery.pageを含めない', () => {
      const items = createTestItems(30)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      currentPage.value = 2
      currentPage.value = 1

      const lastCall = mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0]
      expect(lastCall.query.page).toBeUndefined()
    })

    it('buildQueryFieldsで指定したフィールドがqueryにマージされる', () => {
      const items = createTestItems(10)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        buildQueryFields: () => ({ search: 'vue', tag: 'nuxt' }),
        watchTargets: []
      })

      currentPage.value = 1

      expect(mockReplace).toHaveBeenCalledWith({
        query: expect.objectContaining({ search: 'vue', tag: 'nuxt' })
      })
    })
  })

  describe('watch', () => {
    it('watchTargetsの変更でcurrentPageが1に戻りURLが更新される', async () => {
      const items = createTestItems(30)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })
      const searchQuery = ref('')

      const { currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: [searchQuery]
      })

      currentPage.value = 3
      expect(currentPage.value).toBe(3)
      mockReplace.mockClear()

      searchQuery.value = 'vue'
      await nextTick()

      expect(currentPage.value).toBe(1)
      expect(mockReplace).toHaveBeenCalled()
    })

    it('sortStateの変更でcurrentPageが1に戻る', async () => {
      const items = createTestItems(30)
      const filteredItems = computed(() => items)
      const sortState = ref({ key: 'date', order: 'desc' as const })

      const { currentPage } = usePagination({
        filteredItems,
        perPage: 10,
        defaultSortKey: 'date',
        sortState,
        watchTargets: []
      })

      currentPage.value = 2
      expect(currentPage.value).toBe(2)

      sortState.value = { key: 'name', order: 'asc' }
      await nextTick()

      expect(currentPage.value).toBe(1)
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
