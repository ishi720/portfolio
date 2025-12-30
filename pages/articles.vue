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

        <!-- 検索 + ソート機能 -->
        <div class="pagination-wrapper">
          <SearchBox
            v-model="searchQuery"
            placeholder="記事を検索..."
          />

          <SortControls
            v-model="sortState"
            :options="sortOptions"
            @update:model-value="onSortChange"
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
              <span class="article-tags">{{ article.tags }}</span>
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
import { usePortfolio } from '~/composables/usePortfolio'
import type { SortState, SortOption } from '~/components/SortControls.vue'

interface Article {
  published_at: string
  url: string
  title: string
  tags: string
  source: string
  likes: number
}

const route = useRoute()
const router = useRouter()
const { article_platforms } = usePortfolio()
const articles = ref<Article[]>([])
const perPage = 12

// フィルター用のstate
const searchQuery = ref('')
const selectedTag = ref('')

// ソートオプション
const sortOptions: SortOption[] = [
  { key: 'date', label: '投稿日' },
  { key: 'likes', label: 'いいね数' }
]

// ソート状態
const sortState = ref<SortState>({
  key: 'date',
  order: 'desc'
})

// URLのクエリパラメータからページ番号を取得
const currentPage = computed({
  get: () => {
    const page = Number(route.query.page) || 1
    return Math.max(1, Math.min(page, totalPages.value || 1))
  },
  set: (value: number) => {
    router.push({ query: { ...route.query, page: value > 1 ? value : undefined } })
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

// 人気のタグ（使用回数が多い上位10件）
const popularTags = computed(() => {
  const tagCount: Record<string, number> = {}
  articles.value.forEach(article => {
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

// ソート変更時は1ページ目に戻る
const onSortChange = () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
}

// フィルター変更時は1ページ目に戻る
watch([selectedTag, searchQuery], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style lang="scss" scoped>
.result-count {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}
</style>