<template>
  <section id="future-goals" class="goals-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">個人的に挑戦したいこと</h2>
        <p class="section-subtitle">Future Goals</p>
      </div>
      <div class="goals-card">
        <ul class="goals-list">
          <li v-for="goal in goals" :key="goal">
            <span class="checkbox-icon"></span>
            {{ goal }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  goals: string[]
}>()
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

$radius: $radius-lg;

.goals-section {
  padding: 40px 0;
  background: linear-gradient(180deg, $bg 0%, color.adjust($bg, $lightness: -2%) 100%);
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
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1rem;
    color: $text;
    line-height: 1.6;
    padding: 10px 0;

    &:last-child {
      border-bottom: none;
    }
  }

  .checkbox-icon {
    width: 18px;
    height: 18px;
    border: 2px solid $border;
    border-radius: 4px;
    flex-shrink: 0;
    background: $card-bg;
  }
}

@include mobile {
  .goals-list {
    padding-left: 20px;

    li {
      font-size: 0.95rem;
    }
  }
}
</style>
