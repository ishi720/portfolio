<template>
  <section id="achievements" class="achievements-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">実績</h2>
        <p class="section-subtitle">Achievements</p>
      </div>
      <div class="achievements-grid">
        <NuxtLink to="/developments#npm-packages" class="achievement-card">
          <div class="achievement-icon">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" alt="npm">
          </div>
          <div class="achievement-info">
            <div class="achievement-number">{{ stats.npmPackages }}</div>
            <div class="achievement-label">NPM Packages</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/developments#chrome-extensions" class="achievement-card">
          <div class="achievement-icon">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg" alt="Chrome">
          </div>
          <div class="achievement-info">
            <div class="achievement-number">{{ stats.chromeExtensions }}</div>
            <div class="achievement-label">Chrome Extensions</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/developments#line-stamps" class="achievement-card achievement-card-line">
          <div class="achievement-icon">
            <img src="https://cdn.simpleicons.org/line/06C755" alt="LINE">
          </div>
          <div class="achievement-info">
            <div class="achievement-number">{{ stats.lineStamps }}</div>
            <div class="achievement-label">LINE Stamps</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/developments#web-services" class="achievement-card">
          <div class="achievement-icon">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="Web">
          </div>
          <div class="achievement-info">
            <div class="achievement-number">{{ stats.developments }}</div>
            <div class="achievement-label">Web Services</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/articles?platform=Qiita" class="achievement-card">
          <div class="achievement-icon">
            <img src="https://cdn.simpleicons.org/qiita/55C500" alt="Qiita">
          </div>
          <div class="achievement-info">
            <div class="achievement-number">{{ stats.qiita.posts }}</div>
            <div class="achievement-label">Qiita Posts</div>
            <div class="achievement-sub">{{ stats.qiita.contributions }} contributions</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/articles?platform=Zenn" class="achievement-card">
          <div class="achievement-icon">
            <img src="https://cdn.simpleicons.org/zenn/3EA8FF" alt="Zenn">
          </div>
          <div class="achievement-info">
            <div class="achievement-number">{{ stats.zenn.posts }}</div>
            <div class="achievement-label">Zenn Posts</div>
            <div class="achievement-sub">{{ stats.zenn.contributions }} contributions</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/articles?platform=note" class="achievement-card">
          <div class="achievement-icon">
            <img src="https://cdn.simpleicons.org/note/41C9B4" alt="Note">
          </div>
          <div class="achievement-info">
            <div class="achievement-number">{{ stats.note.posts }}</div>
            <div class="achievement-label">Note Posts</div>
            <div class="achievement-sub">{{ stats.note.contributions }} contributions</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/repositories" class="achievement-card">
          <div class="achievement-icon">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub">
          </div>
          <div class="achievement-info">
            <div class="achievement-number">{{ stats.repos }}</div>
            <div class="achievement-label">GitHub Repositories</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/career" class="achievement-card achievement-card-career">
          <div class="achievement-icon achievement-icon-career">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div class="achievement-info">
            <div class="achievement-label">Career History</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface PlatformStats {
  posts: number
  contributions: number
}

interface Stats {
  npmPackages: number
  chromeExtensions: number
  lineStamps: number
  developments: number
  qiita: PlatformStats
  zenn: PlatformStats
  note: PlatformStats
  repos: number
}

defineProps<{
  stats: Stats
}>()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

$radius: $radius-lg;

.achievements-section {
  padding: 60px 0;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.achievement-card {
  background: $card-bg;
  border-radius: $radius;
  padding: 24px;
  box-shadow: $shadow;
  transition: $transition;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;
    border-color: $primary;

    .achievement-icon img,
    .achievement-icon svg {
      transform: scale(1.1);
    }
  }

  &-line:hover {
    border-color: $color-line;
  }

  &-career {
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text-white;

    .achievement-label {
      color: $text-white;
      font-size: 1rem;
    }

    &:hover {
      border-color: transparent;
    }
  }
}

.achievement-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;

  img, svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: $transition;
  }

  &-career {
    color: $text-white;
  }
}

.achievement-info {
  flex: 1;
}

.achievement-number {
  font-family: $font-en;
  font-size: 2rem;
  font-weight: 700;
  color: $primary;
  line-height: 1;
  margin-bottom: 4px;
}

.achievement-card-line .achievement-number {
  color: $color-line;
}

.achievement-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: $text;
}

.achievement-sub {
  font-size: 0.75rem;
  color: $text-light;
  margin-top: 2px;
}

@include mobile {
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .achievement-card {
    padding: 20px;
  }

  .achievement-number {
    font-size: 1.75rem;
  }
}
</style>
