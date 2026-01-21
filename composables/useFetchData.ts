import { ref, type Ref } from 'vue'

export interface FetchState<T> {
  data: T
  isLoading: boolean
  error: string | null
}

/**
 * 共通のデータ取得composable
 * - 統一されたエラーハンドリング
 * - ローディング状態の管理
 * - デフォルト値のサポート
 */
export const useFetchData = <T>(defaultValue: T) => {
  const data = ref<T>(defaultValue) as Ref<T>
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchData = async (url: string): Promise<T | null> => {
    isLoading.value = true
    error.value = null

    try {
      const result = await $fetch<T>(url)
      data.value = result
      return result
    } catch (e) {
      const message = e instanceof Error ? e.message : 'データの取得に失敗しました'
      error.value = message
      console.error(`Failed to fetch ${url}:`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoading,
    error,
    fetchData
  }
}

/**
 * 複数のデータを並列で取得
 */
export const fetchMultiple = async <T extends Record<string, unknown>>(
  requests: { key: keyof T; url: string }[]
): Promise<{ data: Partial<T>; errors: Record<string, string> }> => {
  const results = await Promise.allSettled(
    requests.map(async ({ key, url }) => {
      const result = await $fetch(url)
      return { key, result }
    })
  )

  const data: Partial<T> = {}
  const errors: Record<string, string> = {}

  results.forEach((result, index) => {
    const { key } = requests[index]
    if (result.status === 'fulfilled') {
      data[key] = result.value.result as T[keyof T]
    } else {
      const message = result.reason instanceof Error ? result.reason.message : 'データの取得に失敗しました'
      errors[key as string] = message
      console.error(`Failed to fetch ${requests[index].url}:`, result.reason)
    }
  })

  return { data, errors }
}
