<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Developments</h1>
        <p class="page-subtitle">個人で開発したWEBサービス・アプリケーション</p>
      </div>
    </section>

    <!-- npm Packages Section -->
    <section class="npm-section" id="npm-section">
      <div class="container">
        <h2 class="section-title">Npm Packages</h2>
        <div class="npm-grid">
          <a v-for="pkg in npmPackages" :key="pkg.name" :href="pkg.url" target="_blank" class="npm-card">
            <div class="npm-header">
              <div class="npm-icon">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" alt="npm">
              </div>
              <div class="npm-info">
                <h3 class="npm-name">{{ pkg.name }}</h3>
                <span class="npm-version">v{{ pkg.version }}</span>
              </div>
            </div>
            <p class="npm-desc">{{ pkg.description }}</p>
            <div class="npm-footer">
              <div class="npm-techs">
                <span v-for="tech in pkg.techs" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Chrome Extensions Section -->
    <section class="works-section" id="chrome-extension-section">
      <div class="container">
        <h2 class="section-title">Chrome Extensions</h2>
        <div class="works-grid">
          <a v-for="chromeExtension in chromeExtensions" :key="chromeExtension.title" :href="chromeExtension.url" target="_blank" class="work-card">
            <div class="work-image">
              <img :src="`/portfolio/images/service/${chromeExtension.image}`" :alt="chromeExtension.title" @error="handleImgError">
              <div class="work-image-placeholder">{{ chromeExtension.title }}</div>
            </div>
            <div class="work-content">
              <h3 class="work-title">{{ chromeExtension.title }}</h3>
              <p class="work-desc">{{ chromeExtension.description }}</p>
              <div class="work-techs">
                <span v-for="tech in chromeExtension.techs" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Web Services Section -->
    <section class="works-section" id="web-services-section">
      <div class="container">
        <h2 class="section-title">Web Services</h2>
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

const { developments, chromeExtensions, npmPackages } = usePortfolio()

const handleImgError = (e: Event) => {
  (e.target as HTMLImageElement).style.display = 'none'
}
</script>
