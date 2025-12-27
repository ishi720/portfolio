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
        <!-- ページネーション -->
        <nav v-if="totalPages > 1" class="pagination">
          <button
            class="pagination-btn pagination-prev"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            ← 前へ
          </button>

          <div class="pagination-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="pagination-num"
              :class="{ active: page === currentPage, ellipsis: page === '...' }"
              :disabled="page === '...'"
              @click="page !== '...' && goToPage(page as number)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="pagination-btn pagination-next"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            次へ →
          </button>
        </nav>

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

const totalPages = computed(() => Math.ceil(articles.value.length / perPage))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return articles.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}
</script>