<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Developments</h1>
        <p class="page-subtitle">個人で開発したWEBサービス・アプリケーション</p>
      </div>
    </section>

    <!-- npm Packages Section -->
    <section id="npm-packages" class="npm-section">
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
    <section id="chrome-extensions" class="works-section">
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

    <!-- LINE Stamps Section -->
    <section id="line-stamps" class="line-section">
      <div class="container">
        <h2 class="section-title">LINE Stamps</h2>
        <div class="line-grid">
          <a v-for="stamp in lineStamps" :key="stamp.title" :href="stamp.url" target="_blank" class="line-card">
            <div class="line-image">
              <img :src="`/portfolio/images/service/${stamp.image}`" :alt="stamp.title" @error="handleImgError">
              <div class="line-image-placeholder">{{ stamp.title }}</div>
            </div>
            <div class="line-content">
              <h3 class="line-title">{{ stamp.title }}</h3>
              <p class="line-desc">{{ stamp.description }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Web Services Section -->
    <section id="web-services" class="works-section">
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

const { developments, chromeExtensions, lineStamps, npmPackages } = usePortfolio()

const handleImgError = (e: Event) => {
  (e.target as HTMLImageElement).style.display = 'none'
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

// LINE Stamps Section
.line-section {
  padding: 60px 0 40px;
  background: linear-gradient(180deg, $bg 0%, darken($bg, 2%) 100%);
}

.line-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.line-card {
  background: $card-bg;
  border-radius: $radius;
  overflow: hidden;
  box-shadow: $shadow;
  transition: $transition;
  border-left: 4px solid $color-line;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;

    .line-image img {
      transform: scale(1.02);
    }
  }
}

.line-image {
  position: relative;
  background: $bg;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: $transition;

    &:not([style*="display: none"]) + .line-image-placeholder {
      display: none;
    }
  }

  &-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: $text-light;
    padding: 20px;
    text-align: center;
    background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%);
  }
}

.line-content {
  padding: 20px;
}

.line-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: $text;
}

.line-desc {
  font-size: 0.85rem;
  color: $text-light;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .line-grid {
    grid-template-columns: 1fr;
  }
}
</style>