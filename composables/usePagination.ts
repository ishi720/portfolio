import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
  const { filteredItems, perPage, defaultSortKey, sortState, buildQueryFields, watchTargets } = options

  const route = useRoute()
  const router = useRouter()

  // ページ番号の内部状態
  const currentPageValue = ref(Number(route.query.page) || 1)

  // 総ページ数
  const totalPages = computed(() => Math.ceil(filteredItems.value.length / perPage))

  // URLのクエリパラメータを更新
  const updateQuery = () => {
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

    router.replace({ query })
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

  // フィルター変更時は1ページ目に戻ってURLを更新
  watch([...watchTargets, sortState], () => {
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
