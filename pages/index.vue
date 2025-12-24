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

        <h2 class="section-title">Skills</h2>
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

        <h2 class="section-title">Contact</h2>
        <section class="contact-section">
          <div class="container">
            <div class="contact-content">
              <div class="contact-info">

                <div class="contact-email">
                  <span class="contact-label">Email</span>
                  <a :href="`mailto:${profile.email}`" class="email-link">{{ profile.email }}</a>
                </div>

                <div class="contact-social">
                  <span class="contact-label">SNS</span>
                  <div class="social-links">
                    <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="social-link">
                      {{ social.name }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePortfolio } from '~/composables/usePortfolio'

const { profile, socials, skills } = usePortfolio()
</script>
