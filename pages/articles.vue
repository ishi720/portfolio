<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Articles</h1>
        <p class="page-subtitle">技術記事（{{ articles.length }}件）</p>
      </div>
    </section>

    <section class="articles-section">
      <div class="container">

        <!-- ページネーション + ソート機能 -->
        <div class="pagination-wrapper">
          <Pagination
            v-model="currentPage"
            :total-pages="totalPages"
          />

          <SortControls
            v-model="sortState"
            :options="sortOptions"
            @update:model-value="onSortChange"
          />
        </div>

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


      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

// ソートされた記事一覧
const sortedArticles = computed(() => {
  const sorted = [...articles.value]

  sorted.sort((a, b) => {
    if (sortState.value.key === 'date') {
      const dateA = new Date(a.published_at).getTime()
      const dateB = new Date(b.published_at).getTime()
      return sortState.value.order === 'desc' ? dateB - dateA : dateA - dateB
    } else {
      return sortState.value.order === 'desc' ? b.likes - a.likes : a.likes - b.likes
    }
  })

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedArticles.value.length / perPage))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return sortedArticles.value.slice(start, end)
})

// ソート変更時は1ページ目に戻る
const onSortChange = () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}
</script>