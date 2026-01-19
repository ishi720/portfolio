<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Articles</h1>
        <p class="page-subtitle">投稿記事（{{ articles.length }}件）</p>
      </div>
    </section>

    <section class="articles-section">
      <div class="container">

        <!-- 検索 + プラットフォーム + ソート機能 -->
        <div class="pagination-wrapper">
          <SearchBox
            v-model="searchQuery"
            placeholder="記事を検索..."
          />

          <!-- プラットフォームフィルター（プルダウン） -->
          <div class="platform-select-wrapper">
            <select
              v-model="selectedPlatform"
              class="platform-select"
              :class="platformSelectClass"
            >
              <option value="">すべて</option>
              <option v-for="platform in platforms" :key="platform.name" :value="platform.name">
                {{ platform.name }}
              </option>
            </select>
          </div>

          <SortControls
            v-model="sortState"
            :options="sortOptions"
          />
        </div>

        <!-- タグフィルター -->
        <TagFilter
          v-model="selectedTag"
          :tags="popularTags"
        />

        <!-- 検索結果件数 -->
        <p class="result-count">{{ filteredArticles.length }}件の記事</p>

        <!-- 記事一覧 -->
        <div class="articles-grid">
          <a v-for="article in paginatedArticles" :key="article.url" :href="article.url" target="_blank" class="article-card">
            <div class="article-meta">
              <span class="article-platform" :class="article.source.toLowerCase()">{{ article.source }}</span>
              <span class="article-date">{{ formatDate(article.published_at) }}</span>
              <span class="article-likes">♥ {{ article.likes }}</span>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <div class="article-footer">
              <div class="article-tags">
                <span
                  v-for="tag in getArticleTags(article.tags)"
                  :key="tag"
                  class="tech-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </a>
        </div>

        <!-- ページネーション -->
        <Pagination
          v-model="currentPage"
          :total-pages="totalPages"
        />


      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SortState, SortOption } from '~/components/SortControls.vue'
import { formatDate } from '~/composables/useUtils'

interface Article {
  published_at: string
  url: string
  title: string
  tags: string
  source: string
  likes: number
}

interface Platform {
  name: string
  class: string
}

const route = useRoute()
const router = useRouter()
const articles = ref<Article[]>([])
const perPage = 18

// プラットフォーム一覧
const platforms: Platform[] = [
  { name: 'Qiita', class: 'platform-qiita' },
  { name: 'Zenn', class: 'platform-zenn' },
  { name: 'note', class: 'platform-note' }
]

// ソートオプション
const sortOptions: SortOption[] = [
  { key: 'date', label: '投稿日' },
  { key: 'likes', label: 'いいね数' }
]

// URLクエリから初期値を取得
const getInitialSortState = (): SortState => {
  const sortKey = route.query.sort as string
  const sortOrder = route.query.order as string
  return {
    key: sortOptions.some(o => o.key === sortKey) ? sortKey : 'date',
    order: (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'desc'
  }
}

// フィルター用のstate（URLクエリから初期化）
const searchQuery = ref((route.query.q as string) || '')
const selectedTag = ref((route.query.tag as string) || '')
const selectedPlatform = ref((route.query.platform as string) || '')
const sortState = ref<SortState>(getInitialSortState())

// プラットフォーム選択時のクラス
const platformSelectClass = computed(() => {
  switch (selectedPlatform.value) {
    case 'Qiita': return 'select-qiita'
    case 'Zenn': return 'select-zenn'
    case 'note': return 'select-note'
    default: return ''
  }
})

// URLクエリを更新する関数
const updateQuery = () => {
  const query: Record<string, string | undefined> = {}

  if (searchQuery.value) {
    query.q = searchQuery.value
  }
  if (selectedTag.value) {
    query.tag = selectedTag.value
  }
  if (selectedPlatform.value) {
    query.platform = selectedPlatform.value
  }
  if (sortState.value.key !== 'date') {
    query.sort = sortState.value.key
  }
  if (sortState.value.order !== 'desc') {
    query.order = sortState.value.order
  }
  if (currentPageValue.value > 1) {
    query.page = String(currentPageValue.value)
  }

  router.replace({ query })
}

// ページ番号の内部状態
const currentPageValue = ref(Number(route.query.page) || 1)

// URLのクエリパラメータからページ番号を取得
const currentPage = computed({
  get: () => {
    return Math.max(1, Math.min(currentPageValue.value, totalPages.value || 1))
  },
  set: (value: number) => {
    currentPageValue.value = value
    updateQuery()
  }
})

onMounted(async () => {
  articles.value = await $fetch('/data/combined_articles.json')
})

// タグを配列として取得するヘルパー関数
const getArticleTags = (tags: string): string[] => {
  if (!tags) return []
  return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
}

// 人気のタグ（プラットフォームでフィルタリング後の記事から上位10件）
const popularTags = computed(() => {
  const tagCount: Record<string, number> = {}

  // プラットフォームでフィルタリング
  let targetArticles = articles.value
  if (selectedPlatform.value) {
    targetArticles = articles.value.filter(article => article.source === selectedPlatform.value)
  }

  targetArticles.forEach(article => {
    getArticleTags(article.tags).forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag)
})

// フィルタリングされた記事一覧
const filteredArticles = computed(() => {
  let result = [...articles.value]

  // プラットフォームフィルター
  if (selectedPlatform.value) {
    result = result.filter(article => article.source === selectedPlatform.value)
  }

  // 検索フィルター
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article =>
      article.title.toLowerCase().includes(query) ||
      (article.tags && article.tags.toLowerCase().includes(query))
    )
  }

  // タグフィルター
  if (selectedTag.value) {
    result = result.filter(article =>
      getArticleTags(article.tags).includes(selectedTag.value)
    )
  }

  // ソート
  result.sort((a, b) => {
    if (sortState.value.key === 'date') {
      const dateA = new Date(a.published_at).getTime()
      const dateB = new Date(b.published_at).getTime()
      return sortState.value.order === 'desc' ? dateB - dateA : dateA - dateB
    } else {
      return sortState.value.order === 'desc' ? b.likes - a.likes : a.likes - b.likes
    }
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / perPage))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredArticles.value.slice(start, end)
})

// プラットフォーム変更時はタグ選択をクリア（タグ一覧が変わるため）
watch(selectedPlatform, () => {
  selectedTag.value = ''
})

// フィルター変更時は1ページ目に戻ってURLを更新
watch([selectedTag, selectedPlatform, searchQuery, sortState], () => {
  currentPageValue.value = 1
  updateQuery()
}, { deep: true })

</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.result-count {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}

// 記事タグ
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

// プラットフォームフィルター（プルダウン）
.platform-select-wrapper {
  position: relative;
}

.platform-select {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 10px 36px 10px 16px;
  border: 1px solid $border;
  border-radius: 8px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: $transition;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  min-width: 120px;

  &:hover {
    border-color: $primary;
  }

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }

  // Qiita選択時
  &.select-qiita {
    border-color: #55c500;
    background-color: rgba(#55c500, 0.05);
    color: #3d8f00;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2355c500' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  }

  // Zenn選択時
  &.select-zenn {
    border-color: #3ea8ff;
    background-color: rgba(#3ea8ff, 0.05);
    color: #0080e0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233ea8ff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  }

  // note選択時
  &.select-note {
    border-color: #41C9B4;
    background-color: rgba(#41C9B4, 0.05);
    color: #2a9d8f;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2341C9B4' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  }
}

@media (max-width: 768px) {
  .platform-select {
    width: 100%;
  }
}
</style>