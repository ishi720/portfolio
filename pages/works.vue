<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Web Service</h1>
        <p class="page-subtitle">制作したWebサービス・アプリケーション</p>
      </div>
    </section>

    <section class="works-section">
      <div class="container">
        <div class="works-grid">
          <a v-for="work in works" :key="work.title" :href="work.url" target="_blank" class="work-card">
            <div class="work-image">
              <img :src="`/portfolio/images/service/${work.image}`" :alt="work.title" @error="handleImgError">
              <div class="work-image-placeholder">{{ work.title }}</div>
            </div>
            <div class="work-content">
              <h3 class="work-title">{{ work.title }}</h3>
              <p class="work-url">{{ work.url }}</p>
              <p class="work-desc">{{ work.description }}</p>
              <div class="work-techs">
                <span v-for="tech in work.techs" :key="tech" class="tech-tag">{{ tech }}</span>
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

const { works } = usePortfolio()

const handleImgError = (e: Event) => {
  (e.target as HTMLImageElement).style.display = 'none'
}
</script>
