<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Developments</h1>
        <p class="page-subtitle">個人で開発したWEBサービス・アプリケーション</p>
      </div>
    </section>

    <section class="works-section">
      <div class="container">
        <div class="works-grid">
          <a v-for="development in developments" :key="development.title" :href="development.url" target="_blank" class="work-card">
            <div class="work-image">
              <img :src="`/portfolio/images/service/${development.image}`" :alt="development.title" @error="handleImgError">
              <div class="work-image-placeholder">{{ development.title }}</div>
            </div>
            <div class="work-content">
              <h3 class="work-title">{{ development.title }}</h3>
              <p class="work-desc">{{ development.description }}</p>
              <div class="work-techs">
                <span v-for="tech in development.techs" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePortfolio } from '~/composables/usePortfolio'

const { developments } = usePortfolio()

const handleImgError = (e: Event) => {
  (e.target as HTMLImageElement).style.display = 'none'
}
</script>
