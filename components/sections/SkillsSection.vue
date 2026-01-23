<template>
  <section id="skills" class="skills-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">技術スタック</h2>
        <p class="section-subtitle">Skills</p>
      </div>
      <div v-if="isReady && tags.length > 0" class="wordcloud-wrapper">
        <WordCloud
          :words="tags"
          :size="size"
          :min-font-size="10"
          :max-font-size="48"
        />
      </div>
      <div v-else class="loading">
        <p>Loading skills...</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import WordCloud from '~/components/WordCloud.vue'

interface TagCount {
  text: string
  size: number
}

defineProps<{
  tags: TagCount[]
  size: number
  isReady: boolean
}>()
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '~/assets/scss/variables' as *;

.skills-section {
  padding: 60px 0;
  background: linear-gradient(180deg, $bg 0%, color.adjust($bg, $lightness: -2%) 100%);
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
</style>
