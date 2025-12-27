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
        <!-- アカウント一覧 -->
        <h2 class="section-title">アカウント</h2>
        <div class="article-platforms-grid">
          <a v-for="article_platform in article_platforms" :key="article_platform.title" :href="article_platform.url" target="_blank" class="article-card">
            <div class="article-platform">{{ article_platform.title }}</div>
            <h3 class="article-title">{{ article_platform.title }}記事一覧</h3>
            <span class="article-link">記事を見る →</span>
          </a>
        </div>

        <h2 class="section-title">投稿記事</h2>

        <!-- ページネーション + ソート機能 -->
        <div class="pagination-wrapper">
          <Pagination
            v-model="currentPage"
            :total-pages="totalPages"
            @change="onPageChange"
          />

          <!-- ソート機能 -->
          <div class="sort-controls">
            <div class="sort-group">
              <label class="sort-label">並び替え:</label>
              <button
                class="sort-btn"
                :class="{ active: sortKey === 'date' }"
                @click="toggleSort('date')"
              >
                投稿日
                <span class="sort-icon">{{ sortKey === 'date' ? (sortOrder === 'desc' ? '↓' : '↑') : '　' }}</span>
              </button>
              <button
                class="sort-btn"
                :class="{ active: sortKey === 'likes' }"
                @click="toggleSort('likes')"
              >
                いいね数
                <span class="sort-icon">{{ sortKey === 'likes' ? (sortOrder === 'desc' ? '↓' : '↑') : '　' }}</span>
              </button>
            </div>
          </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolio } from '~/composables/usePortfolio'

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

// ソート用のstate
const sortKey = ref<'date' | 'likes'>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

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
    if (sortKey.value === 'date') {
      const dateA = new Date(a.published_at).getTime()
      const dateB = new Date(b.published_at).getTime()
      return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
    } else {
      return sortOrder.value === 'desc' ? b.likes - a.likes : a.likes - b.likes
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

// ソートの切り替え
const toggleSort = (key: 'date' | 'likes') => {
  if (sortKey.value === key) {
    // 同じキーなら順序を切り替え
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  } else {
    // 違うキーなら新しいキーで降順からスタート
    sortKey.value = key
    sortOrder.value = 'desc'
  }
  // ソート変更時は1ページ目に戻る
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
}

// ページ変更時の処理
const onPageChange = () => {
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}
</script>