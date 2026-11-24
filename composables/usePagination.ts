import { ref, computed, watch, nextTick, type Ref, type ComputedRef } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import type { SortState } from '~/types/models'

interface UsePaginationOptions<T> {
  /** フィルタ済みアイテムのcomputed */
  filteredItems: ComputedRef<T[]>
  /** 1ページあたりのアイテム数 */
  perPage: number
  /** デフォルトのソートキー */
  defaultSortKey: string
  /** 外部から渡すソート状態 */
  sortState: Ref<SortState>
  /** URLクエリに追加するフィールドを構築する関数 */
  buildQueryFields?: () => Record<string, string | undefined>
  applyQuery?: (query: LocationQuery) => void
  /** フィルター変更を監視するref配列 */
  watchTargets: Ref<unknown>[]
}

/**
 * URLクエリからソート状態の初期値を取得
 */
export const getInitialSortState = (defaultSortKey: string): SortState => {
  const route = useRoute()
  return {
    key: (route.query.sort as string) || defaultSortKey,
    order: (route.query.order as 'asc' | 'desc') || 'desc'
  }
}

export const usePagination = <T>(options: UsePaginationOptions<T>) => {
  const { filteredItems, perPage, defaultSortKey, sortState, buildQueryFields, applyQuery, watchTargets } = options

  const route = useRoute()
  const router = useRouter()

  // ページ番号の内部状態
  const currentPageValue = ref(Number(route.query.page) || 1)

  // 総ページ数
  const totalPages = computed(() => Math.ceil(filteredItems.value.length / perPage))

  const buildQuery = () => {
    const query: Record<string, string | undefined> = {}

    // カスタムフィールドを追加
    if (buildQueryFields) {
      Object.assign(query, buildQueryFields())
    }

    // ソート状態
    if (sortState.value.key !== defaultSortKey) {
      query.sort = sortState.value.key
    }
    if (sortState.value.order !== 'desc') {
      query.order = sortState.value.order
    }

    // ページ番号
    if (currentPageValue.value > 1) {
      query.page = String(currentPageValue.value)
    }

    return query
  }

  // URLのクエリパラメータを更新
  const updateQuery = () => {
    router.replace({ query: buildQuery() })
  }

  // currentPage computed (get/set)
  const currentPage = computed({
    get: () => Math.max(1, Math.min(currentPageValue.value, totalPages.value || 1)),
    set: (value: number) => {
      currentPageValue.value = value
      updateQuery()
    }
  })

  // ページネーションされたアイテム
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage
    const end = start + perPage
    return filteredItems.value.slice(start, end)
  })

  const serializeQuery = (query: Record<string, unknown>) =>
    JSON.stringify(
      Object.entries(query)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
        .sort(([a], [b]) => a.localeCompare(b))
    )

  let isSyncingFromQuery = false
  watch(() => route.query, (query: LocationQuery) => {
    if (serializeQuery(query) === serializeQuery(buildQuery())) return
    isSyncingFromQuery = true
    applyQuery?.(query)
    const nextSort = {
      key: (query.sort as string) || defaultSortKey,
      order: (query.order as 'asc' | 'desc') || 'desc'
    }
    if (nextSort.key !== sortState.value.key || nextSort.order !== sortState.value.order) {
      sortState.value = nextSort
    }
    currentPageValue.value = Number(query.page) || 1
    nextTick(() => {
      isSyncingFromQuery = false
    })
  })

  // フィルター変更時は1ページ目に戻ってURLを更新
  watch([...watchTargets, sortState], () => {
    if (isSyncingFromQuery) return
    currentPageValue.value = 1
    updateQuery()
  }, { deep: true })

  return {
    currentPage,
    totalPages,
    paginatedItems,
    updateQuery
  }
}
