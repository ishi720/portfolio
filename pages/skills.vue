<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title">Skills</h1>
        <p class="page-subtitle">技術スキル</p>
      </div>
    </section>

    <section class="skills-section">
      <div class="container">
        <div class="skills-grid">
          <div v-for="skill in skills" :key="skill.name" class="skill-card">
            <div class="skill-icon">
              <img :src="skill.icon" :alt="skill.name">
            </div>
            <h3 class="skill-name">{{ skill.name }}</h3>
            <div class="skill-bar">
              <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
            </div>
            <span class="skill-level">{{ skill.level }}%</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePortfolio } from '~/composables/usePortfolio'

const { skills } = usePortfolio()
</script>
