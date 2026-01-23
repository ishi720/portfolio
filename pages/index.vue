<template>
  <div>
    <SectionsHeroSection :name="profile.name" />
    <SectionsAboutSection :profile="profile" :socials="socials" />
    <SectionsGoalsSection :goals="futureGoals" />
    <SectionsAchievementsSection :stats="achievementStats" />
    <SectionsSkillsSection :tags="aggregatedTags" :size="cloudSize" :is-ready="isReady" />
    <SectionsContactSection :email="profile.email" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePortfolio } from '~/composables/usePortfolio'
import { useSkillCloud } from '~/composables/useSkillCloud'
import { fetchMultiple } from '~/composables/useFetchData'
import type { Article, Repo } from '~/types/models'

// コンポーネントはNuxtの自動インポートを使用
// components/sections/ 配下のコンポーネントは SectionsXxx として利用可能

const { profile, socials, developments, chromeExtensions, lineStamps, npmPackages } = usePortfolio()
const { aggregatedTags, loadData } = useSkillCloud()

const cloudSize = ref(500)
const isReady = ref(false)
const repoCount = ref(0)
const qiitaStats = ref({ posts: 0, contributions: 0 })
const zennStats = ref({ posts: 0, contributions: 0 })
const noteStats = ref({ posts: 0, contributions: 0 })

// 今後やりたいこと
const futureGoals = [
  'AI（ディープラーニング・深層学習）',
  'Unityでのゲーム開発',
  'スマホアプリの開発',
  'まだ触ったことない技術の開拓',
]

// 実績統計（computed）
const achievementStats = computed(() => ({
  npmPackages: npmPackages.length,
  chromeExtensions: chromeExtensions.length,
  lineStamps: lineStamps.length,
  developments: developments.length,
  qiita: qiitaStats.value,
  zenn: zennStats.value,
  note: noteStats.value,
  repos: repoCount.value
}))

const updateSize = () => {
  if (typeof window !== 'undefined') {
    cloudSize.value = Math.min(window.innerWidth - 48, 500)
  }
}

onMounted(async () => {
  updateSize()
  window.addEventListener('resize', updateSize)
  await loadData()

  // リポジトリと記事データを並列取得
  const { data } = await fetchMultiple<{ repos: Repo[]; articles: Article[] }>([
    { key: 'repos', url: '/data/repos_list.json' },
    { key: 'articles', url: '/data/combined_articles.json' }
  ])

  // リポジトリ数を設定
  if (data.repos) {
    repoCount.value = data.repos.length
  }

  // 記事統計を設定
  if (data.articles) {
    const articles = data.articles as Article[]
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
  }

  setTimeout(() => {
    isReady.value = true
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSize)
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

$radius: $radius-lg;

// Section Header (共通スタイル - 子コンポーネントから継承)
:deep(.section-header) {
  text-align: center;
  margin: 48px 0 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .section-title {
    margin: 0;
    position: relative;

    &::after {
      display: none;
    }
  }
}

:deep(.section-subtitle) {
  display: flex;
  align-items: center;
  gap: 16px;
  color: $text-light;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  margin: 12px 0 0;

  &::before,
  &::after {
    content: '';
    width: 40px;
    height: 1px;
    background: $border;
  }
}
</style>
