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

        <!-- 記事一覧 -->
        <h2 class="section-title">投稿記事</h2>
        <div class="articles-grid">
          <a v-for="article in articles" :key="article.url" :href="article.url" target="_blank" class="article-card">
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
import { ref, onMounted, h } from 'vue'
import { usePortfolio } from '~/composables/usePortfolio'

interface Article {
  published_at: string
  url: string
  title: string
  tags: string
  source: string
  likes: number
}

const { article_platforms } = usePortfolio()
const articles = ref<Article[]>([])
onMounted(async () => {
  articles.value = await $fetch('/data/combined_articles.json')
})
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}
</script>
