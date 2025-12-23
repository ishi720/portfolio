<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Articles</h1>
        <p class="page-subtitle">技術記事</p>
      </div>
    </section>

    <section class="articles-section">
      <div class="container">
        <div class="articles-grid">
          <a v-for="article in articles" :key="article.title" :href="article.url" target="_blank" class="article-card">
            <div class="article-platform">{{ article.platform }}</div>
            <h3 class="article-title">{{ article.title }}</h3>
            <span class="article-link">記事を見る →</span>
          </a>
        </div>
        <div class="articles-note">
          <p>各プラットフォームで技術記事を公開しています。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePortfolio } from '~/composables/usePortfolio'

const { articles } = usePortfolio()
</script>
