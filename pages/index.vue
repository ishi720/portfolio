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

    <!-- About Section -->
    <section id="about-me" class="about-section">
      <div class="container">
        <h2 class="section-title">About Me</h2>
        <div class="about-card">
          <div class="about-content">
            <div class="about-image">
              <img :src="profile.avatar" :alt="profile.name">
            </div>
            <div class="about-text">
              <div class="about-name-row">
                <h3>{{ profile.name }}</h3>
                <span class="about-role">フルスタックエンジニア</span>
              </div>
              <p class="about-bio">{{ profile.bio }}</p>
              <!-- SNS Links -->
              <div class="about-sns">
                <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="about-sns-link">
                  <img :src="getSnsIcon(social.name)" :alt="social.name">
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Future Goals Section -->
    <section id="future-goals" class="goals-section">
      <div class="container">
        <h2 class="section-title">Future Goals</h2>
        <div class="goals-card">
          <ul class="goals-list">
            <li v-for="goal in futureGoals" :key="goal">{{ goal }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Achievements Section -->
    <section id="achievements" class="achievements-section">
      <div class="container">
        <h2 class="section-title">Achievements</h2>
        <div class="achievements-grid">
          <NuxtLink to="/developments" class="achievement-card">
            <div class="achievement-icon">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" alt="npm">
            </div>
            <div class="achievement-info">
              <div class="achievement-number">{{ npmPackages.length }}</div>
              <div class="achievement-label">NPM Packages</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/developments" class="achievement-card">
            <div class="achievement-icon">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg" alt="Chrome">
            </div>
            <div class="achievement-info">
              <div class="achievement-number">{{ chromeExtensions.length }}</div>
              <div class="achievement-label">Chrome Extensions</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/developments" class="achievement-card">
            <div class="achievement-icon">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="Web">
            </div>
            <div class="achievement-info">
              <div class="achievement-number">{{ developments.length }}</div>
              <div class="achievement-label">Web Services</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/articles" class="achievement-card">
            <div class="achievement-icon">
              <img src="https://cdn.simpleicons.org/qiita/55C500" alt="Qiita">
            </div>
            <div class="achievement-info">
              <div class="achievement-number">{{ qiitaStats.posts }}</div>
              <div class="achievement-label">Qiita Posts</div>
              <div class="achievement-sub">{{ qiitaStats.contributions }} contributions</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/articles" class="achievement-card">
            <div class="achievement-icon">
              <img src="https://cdn.simpleicons.org/zenn/3EA8FF" alt="Zenn">
            </div>
            <div class="achievement-info">
              <div class="achievement-number">{{ zennStats.posts }}</div>
              <div class="achievement-label">Zenn Posts</div>
              <div class="achievement-sub">{{ zennStats.contributions }} contributions</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/articles" class="achievement-card">
            <div class="achievement-icon">
              <img src="https://cdn.simpleicons.org/note/41C9B4" alt="Note">
            </div>
            <div class="achievement-info">
              <div class="achievement-number">{{ noteStats.posts }}</div>
              <div class="achievement-label">Note Posts</div>
              <div class="achievement-sub">{{ noteStats.contributions }} contributions</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/repositories" class="achievement-card">
            <div class="achievement-icon">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub">
            </div>
            <div class="achievement-info">
              <div class="achievement-number">{{ repoCount }}</div>
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

    <!-- Skills Section -->
    <section id="skills" class="skills-section">
      <div class="container">
        <h2 class="section-title">Skills</h2>
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

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
      <div class="container">
        <h2 class="section-title">Contact</h2>
        <a :href="`mailto:${profile.email}`" class="contact-card">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <div class="contact-info">
            <h3 class="contact-label">Email</h3>
            <span class="contact-email">{{ profile.email }}</span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePortfolio } from '~/composables/usePortfolio'
import { useSkillCloud } from '~/composables/useSkillCloud'
import WordCloud from '~/components/WordCloud.vue'

const { profile, socials, developments, chromeExtensions, npmPackages } = usePortfolio()
const { aggregatedTags, isLoaded, loadData } = useSkillCloud()

const cloudSize = ref(500)
const isReady = ref(false)
const repoCount = ref(0)
const qiitaStats = ref({ posts: 0, contributions: 0 })
const zennStats = ref({ posts: 0, contributions: 0 })
const noteStats = ref({ posts: 0, contributions: 0 })

// 今後やりたいこと
const futureGoals = [
  'AI（ディープラーニング・深層学習）',
  '3Dゲーム',
  'スマホアプリ',
  'まだ触ったことない言語',
]

const updateSize = () => {
  if (typeof window !== 'undefined') {
    cloudSize.value = Math.min(window.innerWidth - 48, 500)
  }
}

onMounted(async () => {
  updateSize()
  window.addEventListener('resize', updateSize)
  await loadData()

  // リポジトリ数を取得
  try {
    const repos = await $fetch<any[]>('/data/repos_list.json')
    repoCount.value = repos.length
  } catch (e) {
    console.error('Failed to load repos:', e)
  }

  // 記事統計を取得
  try {
    const articles = await $fetch<any[]>('/data/combined_articles.json')
    const qiitaArticles = articles.filter(a => a.source === 'Qiita')
    const zennArticles = articles.filter(a => a.source === 'Zenn')
    const noteArticles = articles.filter(a => a.source === 'note')

    qiitaStats.value = {
      posts: qiitaArticles.length,
      contributions: 1584
    }
    zennStats.value = {
      posts: zennArticles.length,
      contributions: 2
    }
    noteStats.value = {
      posts: noteArticles.length,
      contributions: 0
    }
  } catch (e) {
    console.error('Failed to load articles:', e)
  }

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
    'Note': 'https://cdn.simpleicons.org/note/41C9B4',
    'npm': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg',
    'Wantedly': 'https://cdn.simpleicons.org/wantedly/21BDDB',
    'X': 'https://cdn.simpleicons.org/x/000000',
  }
  return icons[name] || 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/devicon/devicon-original.svg'
}
</script>

<style lang="scss" scoped>
$primary: #4a90a4;
$primary-dark: #3a7a8a;
$bg: #f5f5f5;
$bg-dark: #1a1a2e;
$text: #333;
$text-light: #666;
$text-white: #fff;
$card-bg: #fff;
$border: #e0e0e0;
$shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
$shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.12);
$radius: 12px;
$transition: all 0.3s ease;
$font-ja: 'Noto Sans JP', sans-serif;
$font-en: 'Poppins', sans-serif;

// About Section
.about-section {
  padding: 60px 0 40px;
}

.about-card {
  background: $card-bg;
  border-radius: $radius;
  padding: 32px;
  box-shadow: $shadow;
  max-width: 1000px;
  margin: 0 auto;
}

.about-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  h3 {
    font-family: $font-en;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
}

.about-role {
  font-size: 0.85rem;
  color: $primary;
  background: rgba($primary, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.about-bio {
  color: $text-light;
  line-height: 1.8;
  margin-bottom: 20px;
}

// About SNS Links
.about-sns {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.about-sns-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg;
  border-radius: 50%;
  transition: $transition;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    transition: $transition;
  }

  &:hover {
    background: $primary;
    transform: translateY(-2px);

    img {
      filter: brightness(0) invert(1);
    }
  }
}

// Future Goals Section
.goals-section {
  padding: 40px 0;
  background: linear-gradient(180deg, $bg 0%, darken($bg, 2%) 100%);
}

.goals-card {
  background: $card-bg;
  border-radius: $radius;
  padding: 32px;
  box-shadow: $shadow;
  max-width: 1000px;
  margin: 0 auto;
}

.goals-list {
  margin: 0;
  padding-left: 24px;
  list-style: disc;

  li {
    font-size: 1rem;
    color: $text;
    line-height: 2;
    padding-left: 8px;

    &::marker {
      color: $primary;
    }
  }
}

// Achievements Section
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

// Skills Section
.skills-section {
  padding: 60px 0;
  background: linear-gradient(180deg, $bg 0%, darken($bg, 2%) 100%);
}

.wordcloud-wrapper {
  padding: 24px;
  display: flex;
  justify-content: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: $text-light;
}

// Contact Section
.contact-section {
  padding: 60px 0 80px;
}

.contact-card {
  background: $card-bg;
  border-radius: $radius;
  padding: 32px;
  box-shadow: $shadow;
  transition: $transition;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-hover;

    .contact-icon svg {
      transform: scale(1.1);
    }
  }
}

.contact-icon {
  width: 56px;
  height: 56px;
  color: $primary;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    transition: $transition;
  }
}

.contact-info {
  text-align: left;
}

.contact-label {
  font-family: $font-en;
  font-size: 1.1rem;
  font-weight: 600;
  color: $text;
  margin: 0 0 4px;
}

.contact-email {
  font-size: 0.9rem;
  color: $primary;
  word-break: break-all;
}

// Responsive
@media (max-width: 768px) {
  .about-name-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .about-sns {
    justify-content: flex-start;
  }

  .goals-list {
    padding-left: 20px;

    li {
      font-size: 0.95rem;
    }
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .achievement-card {
    padding: 20px;
  }

  .achievement-number {
    font-size: 1.75rem;
  }

  .contact-card {
    flex-direction: column;
    text-align: center;

    .contact-info {
      text-align: center;
    }
  }
}
</style>