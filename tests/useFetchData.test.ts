import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useFetchData, fetchMultiple } from '../composables/useFetchData'

// $fetchをモック
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('useFetchData', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('初期状態が正しい', () => {
    const { data, isLoading, error } = useFetchData<string[]>([])

    expect(data.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('データ取得に成功した場合', async () => {
    const mockData = [{ id: 1, name: 'Test' }]
    mockFetch.mockResolvedValueOnce(mockData)

    const { data, isLoading, error, fetchData } = useFetchData<typeof mockData>([])

    const result = await fetchData('/api/test')

    expect(result).toEqual(mockData)
    expect(data.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(mockFetch).toHaveBeenCalledWith('/api/test')
  })

  it('データ取得中はisLoadingがtrueになる', async () => {
    let resolvePromise: (value: unknown) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockFetch.mockReturnValueOnce(promise)

    const { isLoading, fetchData } = useFetchData([])

    const fetchPromise = fetchData('/api/test')

    // fetchData呼び出し直後はisLoadingがtrue（非同期処理のため少し待つ）
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(isLoading.value).toBe(true)

    resolvePromise!([])
    await fetchPromise

    expect(isLoading.value).toBe(false)
  })

  it('データ取得に失敗した場合はエラーが設定される', async () => {
    const errorMessage = 'Network error'
    mockFetch.mockRejectedValueOnce(new Error(errorMessage))

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { data, error, fetchData } = useFetchData<string[]>([])

    const result = await fetchData('/api/test')

    expect(result).toBeNull()
    expect(data.value).toEqual([])
    expect(error.value).toBe(errorMessage)
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('エラーがError型でない場合はデフォルトメッセージが設定される', async () => {
    mockFetch.mockRejectedValueOnce('Unknown error')

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { error, fetchData } = useFetchData([])

    await fetchData('/api/test')

    expect(error.value).toBe('データの取得に失敗しました')

    consoleErrorSpy.mockRestore()
  })

  it('連続してfetchDataを呼ぶとエラーがリセットされる', async () => {
    mockFetch.mockRejectedValueOnce(new Error('First error'))
    mockFetch.mockResolvedValueOnce(['success'])

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { data, error, fetchData } = useFetchData<string[]>([])

    await fetchData('/api/first')
    expect(error.value).toBe('First error')

    await fetchData('/api/second')
    expect(error.value).toBeNull()
    expect(data.value).toEqual(['success'])

    consoleErrorSpy.mockRestore()
  })
})

describe('fetchMultiple', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('複数のデータを並列で取得できる', async () => {
    const reposData = [{ id: 1, name: 'repo1' }]
    const articlesData = [{ id: 1, title: 'article1' }]

    mockFetch.mockImplementation((url: string) => {
      if (url === '/api/repos') return Promise.resolve(reposData)
      if (url === '/api/articles') return Promise.resolve(articlesData)
      return Promise.reject(new Error('Unknown URL'))
    })

    const { data, errors } = await fetchMultiple<{ repos: typeof reposData; articles: typeof articlesData }>([
      { key: 'repos', url: '/api/repos' },
      { key: 'articles', url: '/api/articles' }
    ])

    expect(data.repos).toEqual(reposData)
    expect(data.articles).toEqual(articlesData)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('一部のリクエストが失敗しても他のリクエストは成功する', async () => {
    const reposData = [{ id: 1, name: 'repo1' }]

    mockFetch.mockImplementation((url: string) => {
      if (url === '/api/repos') return Promise.resolve(reposData)
      if (url === '/api/articles') return Promise.reject(new Error('Articles fetch failed'))
      return Promise.reject(new Error('Unknown URL'))
    })

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { data, errors } = await fetchMultiple<{ repos: typeof reposData; articles: unknown[] }>([
      { key: 'repos', url: '/api/repos' },
      { key: 'articles', url: '/api/articles' }
    ])

    expect(data.repos).toEqual(reposData)
    expect(data.articles).toBeUndefined()
    expect(errors.articles).toBe('Articles fetch failed')

    consoleErrorSpy.mockRestore()
  })

  it('全てのリクエストが失敗した場合', async () => {
    mockFetch.mockRejectedValue(new Error('All failed'))

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { data, errors } = await fetchMultiple<{ repos: unknown[]; articles: unknown[] }>([
      { key: 'repos', url: '/api/repos' },
      { key: 'articles', url: '/api/articles' }
    ])

    expect(Object.keys(data)).toHaveLength(0)
    expect(errors.repos).toBe('All failed')
    expect(errors.articles).toBe('All failed')

    consoleErrorSpy.mockRestore()
  })

  it('空のリクエスト配列を渡した場合', async () => {
    const { data, errors } = await fetchMultiple<Record<string, never>>([])

    expect(Object.keys(data)).toHaveLength(0)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('エラーがError型でない場合はデフォルトメッセージが設定される', async () => {
    mockFetch.mockRejectedValueOnce('Non-Error rejection')

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { errors } = await fetchMultiple<{ test: unknown }>([
      { key: 'test', url: '/api/test' }
    ])

    expect(errors.test).toBe('データの取得に失敗しました')

    consoleErrorSpy.mockRestore()
  })
})
