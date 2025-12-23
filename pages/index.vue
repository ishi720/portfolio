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
            <div class="social-links">
              <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="social-link">
                {{ social.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePortfolio } from '~/composables/usePortfolio'

const { profile, socials } = usePortfolio()
</script>
