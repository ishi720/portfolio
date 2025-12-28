<template>
  <div>
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Welcome To<br><span>{{ profile.name }} Portfolio</span></h1>
        <div class="scroll-indicator">
          <span>scroll</span>
          <div class="scroll-line"></div>
        </div>
      </div>
    </section>

    <section class="about-section">
      <div class="container">
        <h2 class="section-title">About Me</h2>
        <div class="about-content">
          <div class="about-image">
            <img :src="profile.avatar" :alt="profile.name">
          </div>
          <div class="about-text">
            <h3>{{ profile.name }}</h3>
            <p>{{ profile.bio }}</p>
          </div>
        </div>

        <h2 class="section-title">Skills</h2>
        <section class="skills-section">
          <div class="container">
            <div v-if="isReady && aggregatedTags.length > 0" class="wordcloud-wrapper">
              <WordCloud
                :words="aggregatedTags"
                :size="cloudSize"
                :min-font-size="10"
                :max-font-size="48"
              />
            </div>
            <div v-else class="loading">
              <p>Loading skills...</p>
            </div>
          </div>
        </section>

        <!-- Connect Section -->
        <h2 class="section-title">Connect</h2>
        <section class="connect-section">
          <div class="container">
            <div class="connect-grid">
              <!-- SNS Links - 3列 -->
              <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="connect-card">
                <div class="connect-icon">
                  <img :src="getSnsIcon(social.name)" :alt="social.name">
                </div>
                <h3 class="connect-name">{{ social.name }}</h3>
              </a>

              <!-- Email - 横幅いっぱい -->
              <a :href="`mailto:${profile.email}`" class="connect-card connect-card-email">
                <div class="connect-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div class="connect-info">
                  <h3 class="connect-name">Email</h3>
                  <span class="connect-link">{{ profile.email }}</span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePortfolio } from '~/composables/usePortfolio'
import { useSkillCloud } from '~/composables/useSkillCloud'
import WordCloud from '~/components/WordCloud.vue'

const { profile, socials } = usePortfolio()
const { aggregatedTags, isLoaded, loadData } = useSkillCloud()

const cloudSize = ref(500)
const isReady = ref(false)

const updateSize = () => {
  if (typeof window !== 'undefined') {
    cloudSize.value = Math.min(window.innerWidth - 48, 500)
  }
}

onMounted(async () => {
  updateSize()
  window.addEventListener('resize', updateSize)
  await loadData()
  // データ読み込み後に少し待ってからレンダリング
  setTimeout(() => {
    isReady.value = true
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSize)
})

const getSnsIcon = (name: string): string => {
  const icons: Record<string, string> = {
    'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    'Qiita': 'https://cdn.simpleicons.org/qiita/55C500',
    'Zenn': 'https://cdn.simpleicons.org/zenn/3EA8FF',
    'npm': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg',
    'Wantedly': 'https://cdn.simpleicons.org/wantedly/21BDDB',
    'X': 'https://cdn.simpleicons.org/x/000000',
  }
  return icons[name] || 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/devicon/devicon-original.svg'
}
</script>

<style lang="scss" scoped>
.skills-section {
  padding: 20px 0 40px;
}

.wordcloud-wrapper {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #666;
}
</style>