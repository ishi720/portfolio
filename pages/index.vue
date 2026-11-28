<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">{{ profile.name }} Portfolio</h1>
      </div>
    </section>
    <SectionsServicesSliderSection :services="pickupServices" />
    <SectionsAboutSection :profile="profile" :socials="socials" />
    <SectionsGoalsSection :goals="futureGoals" />
    <SectionsAchievementsSection :stats="achievementStats" />
    <SectionsSkillsSection :tags="aggregatedTags" :size="cloudSize" :is-ready="isReady" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePageSeo } from '~/composables/usePageSeo'
import { usePortfolio } from '~/composables/usePortfolio'

usePageSeo({
  title: 'Home',
  description: 'ishi720のポートフォリオサイトです。個人開発したWebサービス、Chrome拡張機能、VS Code拡張機能、npmパッケージ、LINEスタンプ、技術記事などを紹介しています。',
  path: '/',
})
import { useSkillCloud } from '~/composables/useSkillCloud'
import { useArticleSummaries, useRepoSummaries } from '~/composables/useSiteData'

// コンポーネントはNuxtの自動インポートを使用
// components/sections/ 配下のコンポーネントは SectionsXxx として利用可能

const { profile, socials, developments, chromeExtensions, vscodeExtensions, lineStamps, npmPackages, composerPackages } = usePortfolio()

const pickupTitles = [
  'ポケモンパーティメーカー',
  'キーボードUI',
  'ハニカム構造リバーシ',
  'ホテリングの法則シミュレーター',
  'Feeduck',
  'うちのドラム式',
  '3Dマインスイーパー',
  'ラバーペンシル現象',
  'ReuleauxPhysics',
]
const pickupServices = [
  ...developments,
  ...chromeExtensions,
  ...(lineStamps as { title: string; url: string; image: string; description: string }[]).map(({ title, url, image, description }) => ({ title, url, image, description, techs: [] as string[] })),
]
  .filter(s => pickupTitles.includes(s.title))
  .sort((a, b) => pickupTitles.indexOf(a.title) - pickupTitles.indexOf(b.title))
const { data: articles } = useArticleSummaries()
const { data: repos } = useRepoSummaries()
const { aggregatedTags } = useSkillCloud(articles, repos)

const cloudSize = ref(500)
const isReady = ref(false)

const countBySource = (source: string) => articles.value.filter(a => a.source === source).length

// 個人的に挑戦したいこと
const futureGoals = [
  'AI（ディープラーニング・深層学習）',
  'Unityでのゲーム開発',
  'スマホアプリの開発',
  'まだ触ったことない技術の開拓',
]

// 実績統計（computed）
const achievementStats = computed(() => ({
  npmPackages: npmPackages.length,
  composerPackages: composerPackages.length,
  chromeExtensions: chromeExtensions.length,
  vscodeExtensions: vscodeExtensions.length,
  lineStamps: lineStamps.length,
  developments: developments.length,
  qiita: { posts: countBySource('Qiita'), contributions: 1584 },
  zenn: { posts: countBySource('Zenn'), contributions: 2 },
  note: { posts: countBySource('note'), contributions: 0 },
  repos: repos.value.length
}))

const updateSize = () => {
  if (typeof window !== 'undefined') {
    cloudSize.value = Math.min(window.innerWidth - 48, 500)
  }
}

onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize)

  setTimeout(() => {
    isReady.value = true
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSize)
})
</script>

